const { parentPort, workerData } = require('worker_threads');
const Language = require('../config/language/LanguageFactory');
const LanguageContainer = require('../config/executable');
const { WorkerJob, WorkerSend, WorkerReponse } = require('./job');
const { defaultMaxListeners } = require('events');

const ProblemService=require("../services/admin/ProblemService")

const AdminService=require('../services/AdminService')

let /** @type LanguageContainer */ dockerContainer;
let /** @type Array<String> */ inps;
let /** @type Array<String> */ outs;

const EXECUTE_CODE_STATUS = {
  AC: "AC",
  TLE: "TLE",
  WA: "WA",
  RE: "RE",
  MLE: "MLE",
  CE : "CE",
  CAN_CHECK_ANSWER: "CAN_CHECK_ANSWER",
};

function createWorkerResponse(type) {
  if (dockerContainer) {
    return new WorkerReponse(type, dockerContainer.id, null);
  } else {
    return new WorkerReponse(type, -1, null);
  }
}

async function createContainer(wokerData) {
  console.log("STEP 1: Create Container")
  const /** @type Language.SUPPORTED */ languageType = wokerData.languageType;
  const timeLimited = wokerData.timeLimited;
  const executionPath = workerData.workingDirectory;
  const language = Language.create(languageType, executionPath);
  
  try {
   
    dockerContainer = new LanguageContainer(language, timeLimited);
  } catch (error) {
    let response = createWorkerResponse(WorkerJob.TYPE.STARTING);
    console.log(error)
    response.data = error;
    return;
  }

  let response = createWorkerResponse(WorkerJob.TYPE.STARTING);
  try {
    await dockerContainer.initContainer();
    response.data = true;
  } catch (error) {
    response.data = error;
  }

  parentPort.postMessage(response);
}

/**
 * @param {WorkerSend} message 
 */
function handleSendMessage(message) {
  switch (message.type) {
    case WorkerJob.TYPE.UPDATE_TIME_LIMITED:
      updateTimeLimited(message.data);
      break;
    case WorkerJob.TYPE.CREATE_FILE:
      createFile(message.data)
      break;

    case WorkerJob.TYPE.EXECUTING:
      runCodeWithoutSaving(message.data);
      break;

    case WorkerJob.TYPE.STOP_AND_REMOVE:
      stopAndRemove();
      break;

    case WorkerJob.TYPE.RECREATE_CONTAINER:
      createContainer(message.data);
      break;

    case WorkerJob.TYPE.EXECUTING_SA:
      runCodeWithSaving(message.data);
      break;

      //add executer usercode
      case WorkerJob.TYPE.EXECUTING_USER_CODE:
      runCodeFromUser(message.data);
      break;

    default:
      console.log("Unknow type: " + message.type);
  }
}

/**
 * @param {{buffer : string, fileName : string}} data 
 */
async function createFile(data) {
  console.log("STEP 2: Create Source file")
  let response = createWorkerResponse(WorkerJob.TYPE.CREATE_FILE);
  try {
    await dockerContainer.createFileWithBuffer(data.buffer, data.fileName);
    updateFileName(data.fileName);
    response.data = true;
  } catch (error) {
    response.data = error;
  }
  parentPort.postMessage(response);
}

function updateFileName(fileName) {
  let language = dockerContainer.language;
  language.updateFilename(fileName);
}

function checkOutput(stdout, output) {
  if(stdout.length === 0) {
    return false;
  }

  for (let i = 0; i < stdout.length; i++) {
    if (stdout[i] !== output[i]) {
      return false;
    }
  }
  return true;
}

function convertToStatus(runInfo) {
    if (runInfo.timeExecute == -1) {
      return EXECUTE_CODE_STATUS.TLE;
    }

    if (runInfo.exitCode == 137) {
      return EXECUTE_CODE_STATUS.MLE;
    }

    if (runInfo.exitCode !== 0) {
      return EXECUTE_CODE_STATUS.RE;
    }

    return EXECUTE_CODE_STATUS.CAN_CHECK_ANSWER;

}

async function runCodeWithSaving(data) {
  console.log("STEP 3: Compile && Run code with saving")
  let response = createWorkerResponse(WorkerJob.TYPE.EXECUTING);
  try {
    

    let startCompile = Date.now();
    console.log(startCompile);
    await dockerContainer.compile();
    await getTestCase(data.problemId);
    let listTestInfo = [];
    if (inps.length === 0) {
      response.data = {
        status: false,
        runInfo: "This problem has no test, please try later"
      };
      parentPort.postMessage(response);
      return;
    }

    for (let index in inps) {
      try {
        // let runInfo = await dockerContainer.run(inps[index], outs[index]);
        let runInfo = await dockerContainer.run(inps[index],outs[index]);


        let runStatus = convertToStatus(runInfo);
        if (runStatus === EXECUTE_CODE_STATUS.CAN_CHECK_ANSWER) {
          if (checkOutput(runInfo.stdout, runInfo.output)) {
            runStatus = EXECUTE_CODE_STATUS.AC;
          } else {
            runStatus = EXECUTE_CODE_STATUS.WA;
          }
        }

        runInfo.status = runStatus;

        // Chỉ chạy tiếp khi mà test case được AC, nếu khác AC
        // Trả về testcase bị lỗi và break, không chạy testcase khác
        listTestInfo.push(runInfo);
        await dockerContainer.handleFinishCompile(); // restart container to check memory
        if (runInfo.status !== EXECUTE_CODE_STATUS.AC) {
          break;
        }
        await dockerContainer.handleFinishCompile(); // restart container to check memory
      } catch (error) {
        throw error;
      }
    }

    let isPassAllTestCase = true;
    let maxUsageMemory = -1;
    let maxUsageTime = -1;
    let numberTestcasePass=0;
    for (let testCase of listTestInfo) {
      if (testCase.status === EXECUTE_CODE_STATUS.AC) {
        numberTestcasePass++;
        continue;
      } else {
        isPassAllTestCase = false;
  
      }
    }

    if (isPassAllTestCase) {
      for (let testCase of listTestInfo) {
        maxUsageMemory = Math.max(testCase.totalUsageMemory, maxUsageMemory);
        maxUsageTime = Math.max(testCase.timeExecute, maxUsageTime);
      }
      listTestInfo = [];
      listTestInfo.push({
        status : EXECUTE_CODE_STATUS.AC,
        numberTestcasePass : inps.length,
        numberTestcase : inps.length,
        timeExecute : maxUsageTime,
        memoryUsage : maxUsageMemory,
      })
    } else {
      // Chỉ lấy ra test case bị sai
      // listTestInfo.splice(0, listTestInfo.length - 1);
      listTestInfo.push({
        status : EXECUTE_CODE_STATUS.WC,
        numberTestcasePass :numberTestcasePass,
        numberTestcase : inps.length,
        
      })
    }

    response.data = {
      status: true,
      runInfo: listTestInfo
    };
  } catch (error) {
    response.data = {
      status: false,
      runInfo: error
    };
  }
  parentPort.postMessage(response);
}

async function runCodeWithoutSaving(data) {
  console.log("STEP 3: Compile && Run code without saving")
  let response = createWorkerResponse(WorkerJob.TYPE.EXECUTING);
  try {

    let startCompile = Date.now();
    await dockerContainer.compile();
    console.log("Complie in : " + (Date.now() - startCompile));
    await getTestCase(data.problemId);

    let listTestInfo = [];

    if (inps.length === 0) {
      response.data = {
        status: false,
        runInfo: "This problem has no test, please try later"
      };
      parentPort.postMessage(response);
      return;
    }
    for (let index in inps) {
      try {
        let runInfo = await dockerContainer.run(inps[index], outs[index]);
          console.log(runInfo)
        let runStatus = convertToStatus(runInfo);
        if (runStatus === EXECUTE_CODE_STATUS.CAN_CHECK_ANSWER) {
          if (checkOutput(runInfo.stdout, runInfo.output)) {
            runStatus = EXECUTE_CODE_STATUS.AC;
          } else {
            runStatus = EXECUTE_CODE_STATUS.WA;
          }
        }

        runInfo.status = runStatus;
        listTestInfo.push(runInfo);
        await dockerContainer.handleFinishCompile(); // restart container to check memory
      } catch (error) {
        throw error;
      }
    }
    response.data = {
      status: true,
      runInfo: listTestInfo
    };
  } catch (error) {
    response.data = {
      status: false,
      runInfo: error
    };
  }
  parentPort.postMessage(response);
}
async function runCodeFromUser(data) {
  console.log("STEP 3: Compile && Run code from user")
  let response = createWorkerResponse(WorkerJob.TYPE.EXECUTING);
  try {
    let startCompile = Date.now();
    await dockerContainer.compile();
    console.log("Compile in : " + (Date.now() - startCompile));

    let listTestInfo = [];
    for (let input of data.customInput) {
      try {
        console.log('input',input)
        let runInfo = await dockerContainer.run(input);
        console.log(runInfo);
        
        // We don't check for correctness here, just capture the output
        runInfo.status = convertToStatus(runInfo);
        if (runInfo.status === EXECUTE_CODE_STATUS.CAN_CHECK_ANSWER) {
          runInfo.status = EXECUTE_CODE_STATUS.AC;  // Consider it "accepted" if it runs without errors
        }

        listTestInfo.push(runInfo);
        await dockerContainer.handleFinishCompile(); // restart container to check memory
      } catch (error) {
        throw error;
      }
    }
    response.data = {
      status: true,
      runInfo: listTestInfo
    };
  } catch (error) {
    response.data = {
      status: false,
      runInfo: error
    };
  }
  parentPort.postMessage(response);
}



async function stopAndRemove() {
  let response = createWorkerResponse(WorkerJob.TYPE.STOP_AND_REMOVE);
  try {
    await dockerContainer.stopAndRemoveContainer();
    response.data = true;
  } catch (error) {
    response.data = error;
  }

  parentPort.postMessage(response);
}

/**
 * @param {{timeLimited : number}}
 */
function updateTimeLimited(data) {
  dockerContainer.updateTimelimited(data.timeLimited);
}

async function getTestCase(problemId) {
  return new Promise(async (resolve, reject) => {
    try {
      const results= await ProblemService.getProblemTestCase(problemId)
      console.log('result testcase', results)
      // const result = await AdminService.getTestCase(problemId)
      

      let inp = [];
      let out = [];
      results.forEach(testcase => {
        inp.push(testcase.input + '\n');
        out.push(testcase.output + '\n'); // Thêm '\n' vào output để phù hợp với định dạng yêu cầu
      });

      inps=inp;
      outs=out;
      console.log('inps',inps,'outs',outs);
      // const fakeData = {
      //   input: ["2 3 ","3 6 "], // Mảng các input giả lập
      //   output: ["5\n","8\n"]       // Mảng các output giả lập
      // };

      // inps = fakeData.input;
      // outs = fakeData.output;
    
      console.log(inps)
      resolve(true);
    } catch (error) {
      reject(error);
    }
  })
}

parentPort.on('message', async function (/** @type WorkerSend */ data) {
  handleSendMessage(data);
})

createContainer(workerData);
