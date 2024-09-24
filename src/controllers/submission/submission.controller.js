



const { WorkerQueueSingleton, JobData } = require("../../workers/queue");
const SubmitCodeService = require('../../services/user/SubmitCodeService');



exports.initServer = async (req, res) => {
  res.status(200).send({ message: "Hello World" });
};

/**
 * @param {{userId : number, authenedRoles : Array<String>, body : {source : string, problemId : int}, language : String}} req
 * @param {*} res
 */
exports.runWithoutStoreData = async (req, res) => {
  let workerQueue = WorkerQueueSingleton.getInstance();

  let jobData = new JobData(2000 /** ms */, 256, req.body.language);
  jobData.source = req.body.source;
  jobData.problemId = req.body.problemId;
  
  jobData.handleRunFinishCallback = async function (data) {
    res.status(200).send(data);
  };
 
  workerQueue.addJob(jobData);
};

/**
 * @param {{userId : number, authenedRoles : Array<String>, body : {source : string, problemId : int}}} req
 * @param {*} res
 */
exports.runWithStoreData = async (req, res) => {

  let workerQueue = WorkerQueueSingleton.getInstance();
  //tạo worker queue
  let jobData = new JobData(2000 /** ms */, 256, req.body.language);
  jobData.source = req.body.source;
  jobData.problemId = req.body.problemId;
  jobData.isStore = true;
  jobData.handleRunFinishCallback = async function (runInfo) {
    console.log(runInfo)
    try {
      let info = {
        user_id: req.body.userId,
        problem_id: jobData.problemId,
        source: jobData.source,
        language_id: req.body.language==="cpp"?"1":"2",
        status: null,
        numberTestcasePass: null,
        numberTestcase: null,
        points: null,
        error: null,
        timeExecute: null,
        memoryUsage: null
      };
      const runinfofake={
        "type": "executing",
        "containerId": 7175,
        "data": {
          "status": true,
          "runInfo": [
            {
              "timeExecute": 37,
              "totalUsageMemory": 0.953125,
              "exitCode": 0,
              "stdout": "57\n",
              "output": "57\n",
              "input": "12 45\n",
              "status": "AC"
            },
            {
              "timeExecute": 41,
              "totalUsageMemory": 0.9375,
              "exitCode": 0,
              "stdout": "9\n",
              "output": "9\n",
              "input": "4 5\n",
              "status": "AC"
            },
            {
              "timeExecute": 41,
              "totalUsageMemory": 0.96875,
              "exitCode": 0,
              "stdout": "9\n",
              "output": "9\n",
              "input": "4 5\n",
              "status": "AC"
            },
            {
              "timeExecute": 41,
              "totalUsageMemory": 0.953125,
              "exitCode": 0,
              "stdout": "6\n",
              "output": "6\n",
              "input": "3 3\n",
              "status": "AC"
            },
            {
              "timeExecute": 32,
              "totalUsageMemory": 0.96484375,
              "exitCode": 0,
              "stdout": "8\n",
              "output": "6\n",
              "input": "3 5\n",
              "status": "WA"
            },
            {
              "numberTestcasePass": 4,
              "numberTestcase": 6
            }
          ]
        }
      }
      if (runInfo.data.status === false) {
        info.status = "Lỗi chương trình";
        info.error = runInfo.data.runInfo;
        info.points = 0;
      } else {
        const testCases = runInfo.data.runInfo;
        const totalTestCases = testCases.length - 1; // Trừ 1 vì phần tử cuối cùng là thông tin tổng hợp
        const passedTestCases = testCases.filter(test => test.status === "AC").length;
        
        info.status ="Không có lỗi"
        
        if (passedTestCases === 0 ||totalTestCases===0) {
          info.points = 0;
        } else {
          info.points = Math.floor((passedTestCases / totalTestCases) * 100);
        }
        info.numberTestcasePass = passedTestCases;
        info.numberTestcase = totalTestCases;
        info.timeExecute = testCases.reduce((max, test) => Math.max(max, test.timeExecute || 0), 0);
        info.memoryUsage = testCases.reduce((max, test) => Math.max(max, test.totalUsageMemory || 0), 0);
      }

      const submitResult = await SubmitCodeService.insertSubmitResult(info);
     
      res.status(200).send({
        runningInfo: runInfo,
        submitResult: submitResult
      });
    } catch (error) {
      res.status(500).send({
        message: "Xảy ra lỗi khi thực hiện lưu vào Database",
        error: JSON.stringify(error),
      });
    }
  };
  workerQueue.addJob(jobData);
};





/**
 * @param {{userId : number, authenedRoles : Array<String>, body : {source : string, problemId : int}}} req
 * @param {*} res
 */
exports.getSubmissionById = async (req, res) => {
  let userId = req.userId;
  let problemId = req.body.problemId;
  if (!problemId) {
    res.status(500).send({ message: "problemId không tồn tại" });
    return;
  }
  try {
    let listSubmission = await Submission.findAll({
      where: {
        ownerId: userId,
        problemId: problemId,
      },
    });
    let resData = [];
    for (let submission of listSubmission) {
      resData.push(submission.dataValues);
    }
    res.status(200).send({ listSubmissions: resData });
  } catch (error) {
    res.status(500).send({ message: "Lỗi khi lấy thông tin về Submission" });
  }
};

exports.getAllSubmissions = async (req, res) => {
  let userId = req.userId;
  try {
    let listSubmission = await Submission.findAll({
      where: {
        ownerId: userId,
      },
    });
    let resData = [];
    for (let submission of listSubmission) {
      resData.push(submission.dataValues);
    }
    res.status(200).send({ listSubmissions: resData });
  } catch (error) {
    res.status(500).send({ message: "Lỗi khi lấy thông tin về Submission" });
  }
};



exports.runCode = async (req, res) => {
  const { source_code, language, input } = req.body;
  console.log(source_code)
  if (!source_code || !language || !input || !Array.isArray(input)) {
    return res.status(400).send({ error: "Invalid input parameters" });
  }

  let workerQueue = WorkerQueueSingleton.getInstance();

  // Create a JobData instance
  let jobData = new JobData(2000 /* ms */, 256, language);
  jobData.source = source_code;
  
  // Convert input array to the format expected by the worker
  jobData.customInput = input.map(inp => inp + "\n");

  jobData.handleRunFinishCallback = async function (runInfo) {
    // if (runInfo.data.status === false) {
    //   return res.status(500).send({ 
    //     error: runInfo.data.runInfo,
    //     runInfo:runInfo
    //    });
    // }

    // Extract outputs from the runInfo
    // const outputs = runInfo.data.runInfo.map(test => test.stdout.trim());
    // res.status(200).send({ output: outputs });


   
  
    res.status(200).send({ 
      runInfo:runInfo
     });


    // if (Array.isArray(runInfo.data.runInfo)) {
    //   const outputs = runInfo.data.runInfo.map(test => {
    //       if (test.stdout && typeof test.stdout === 'string') {
    //           return test.stdout.trim();
    //       } else {
    //           console.warn('stdout is not a string or is undefined', test);
    //           return ''; // Hoặc một giá trị mặc định khác
    //       }
    //   });
    //   res.status(200).send({ output: outputs });
    //  } else {
    //   console.error('runInfo.data.runInfo is not an array or is undefined');
    //   // Xử lý lỗi ở đây
    //   res.status(200).send({ output: 'no infomation' });
  // }


    
  };

  workerQueue.addJob(jobData);
};