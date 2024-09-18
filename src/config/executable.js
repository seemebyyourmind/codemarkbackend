const Docker = require('dockerode');
const Stream = require('stream');
const BaseLanguage = require('./language/_base');

class LanguageContainer {
    /** @type number */ id = null;
    /** @type boolean */ isExecuting = null;
    /** @type Docker */ docker = null;
    /** @type Docker.Container */ container = null;
    /** @type BaseLanguage */ language = null;
    /** @type number */ timeLimited = null; /* milisec */ 

    setIsExecuting() {
        this.isExecuting = true;
    }

    setIsNotExecuting() {
        this.isExecuting = false;
    }

    constructor(language, timeLimited) {
        if (!timeLimited || !language)  {
            throw "[constructorContainer-Error] : Not enough infomation to create Container";
        }
        this.docker = new Docker();
        this.id = Math.floor(Math.random() * 10000);
        this.language = language;
        this.timeLimited = timeLimited;
    }

    async initContainer() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.createContainer();
                await this.startContainer();
                resolve(true);
            } catch (error) {
                reject(error)
            }
        })
    }


    async createContainer() {
        return new Promise(async (resolve, reject) => {
            try {
                this.container = await this.docker.createContainer(this.language.languageConfig);
                resolve(true);
            } catch (error) {
                reject('[createContainer-Error] ' + error);
            }
        })
    }

    async startContainer() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.container.start();
                resolve(true);
            } catch (error) {
                reject('[startContainer-Error] ' + error);
            }
        })
    }


    async stopAndRemoveContainer() {
        await this.container.remove({force : true});
    }

    /**
     * @param {Docker.Exec} exec 
     */
    async handleFinishRun(exec, beginTime) {
        // DEBUG
        let timeExecute = (Date.now() - beginTime);
        let container = this.container;
        let stats = await container.stats({ stream: false, "one-shot": true });
        // let totalUsageMemory = (stats.memory_stats.max_usage - stats.memory_stats.usage) / 1024
        let totalUsageMemory = stats.memory_stats.usage / 1024 / 1024  // in MB
        // DEBUG

        let abortControler = new AbortController();
        let inspectInfo = await exec.inspect();
        let exitCode = inspectInfo.ExitCode;
        return {
            timeExecute : timeExecute,
            totalUsageMemory : totalUsageMemory,
            exitCode : exitCode
        }
    }

    async handleStopAndRun() {
        try {
            await this.container.stop({signal : 'SIGKILL'}); // <--- Bị lỗi tại chỗ này
            // khởi động lại container
            await this.startContainer();
            let stats = await container.stats({ stream: false, "one-shot": true });
        } catch (error) {
            console.log("Lỗi khi bắt đầu lại container sau khi run " + error); // <--- Dẫn tới chỗ này xảy ra bug, và không thể chạy tiếp được
        }
    }


    async handleFinishCompile() {
        try {
            await this.container.stop({signal : 'SIGKILL'});
            // khởi động lại container
            await this.startContainer();
        } catch (error) {
            console.log("Lỗi khi bắt đầu lại container sau khi compile " + error);
        }
    }

    async compile() {
        const { container, language } = this;
        const compileOption = language.compileOption;

        // Đối với ngôn ngữ không cần compile
        if (compileOption === null) {
            return true;
        }

        return new Promise(async (resolve, reject) => {
            try {
                this.setIsExecuting();
                const exec = await container.exec(compileOption);
                const execStream = await exec.start({
                    hijack: true,
                    stdin: true
                });

                var stdout = new Stream.PassThrough();
                var stderr = new Stream.PassThrough();
                var stdoutBuffer = "";
                var stderrBuffer = "";

                this.container.modem.demuxStream(execStream, stdout, stderr);

                stderr.on('data', function (chunk) {
                    stderrBuffer += chunk;
                })

                stdout.on('data', function (chunk) {
                    stdoutBuffer += chunk;
                })

                execStream.on('finish', async () => {
                    if (stderrBuffer === "") {
                        await this.handleFinishCompile();
                        resolve(true);
                    } else {
                        reject("Lỗi biên dịch: " + stderrBuffer.replaceAll(this.language.baseFileName, "Source"));
                    }
                    this.setIsNotExecuting();
                })
            } catch (error) {
                this.setIsNotExecuting()
                reject('Đã xảy ra lỗi khi thực thi lệnh compile trong container:', error);
                
            }
        })
    }

    async run(input, output) {
        const { container, language } = this;
        const runOption = language.runOption;

        return new Promise(async (resolve, reject) => {
            try {
                this.setIsExecuting();
                const exec = await this.container.exec(runOption);
                const execStream = await exec.start({
                    hijack: true,
                    stdin: true
                });

                let beginTime = Date.now();

                var stdout = new Stream.PassThrough();
                var stderr = new Stream.PassThrough();
                var stdoutBuffer = "";
                var stderrBuffer = "";

                this.container.modem.demuxStream(execStream, stdout, stderr);

                let buffer = Buffer.from(input, 'ascii');
                execStream.write(buffer, 'ascii');


                stderr.on('data', function (chunk) {
                    stderrBuffer += chunk;
                })

                stdout.on('data', function (chunk) {
                    stdoutBuffer += chunk;
                })

                try {
                    await new Promise((resolve, reject) => {
                        const timeoutId = setTimeout(() => {
                            execStream.destroy();
                            reject(new Error('Command timed out'));
                        }, this.timeLimited);

                        execStream.on('end', () => {
                            clearTimeout(timeoutId);
                            this.setIsNotExecuting();
                            resolve();
                        });
                    });
                } catch (error) {
                    resolve({timeExecute : -1})
                }

                let self = this;

                execStream.on('finish', async () => {
                    let data = {};
                    let inspecInfo = await self.handleFinishRun(exec, beginTime);
                    this.setIsNotExecuting();
                    if (stderrBuffer !== "") {
                        reject('[LanguageContainer - stderr] ' + stderrBuffer);
                    } else {
                        resolve({
                            ...inspecInfo,
                            stdout : stdoutBuffer,
                            output : output,
                            input : input
                        })
                    }
                })
            } catch (error) {
                this.setIsNotExecuting();
                reject('[LanguageContainer - run] '+ error);
            }
        })
    }

    async createFileWithBuffer(buffer, fileName) {
        // console.log('buffer',buffer)
        return new Promise(async (resolve, reject) => {
            let writeFileOpt = {
                Cmd: [
                    'sh',
                    '-c',
                    `printf '%s' '${buffer}' > ${fileName}`
                    // sửa echo thành printf %s
                ],
                AttachStdout: true,
                AttachStderr: true
            };

            let container = this.container;

            const exec = await container.exec(writeFileOpt);
            const execStream = await exec.start({
                hijack: true,
                stdin: true
            });

            var stdout = new Stream.PassThrough();
            var stderr = new Stream.PassThrough();
            var stdoutBuffer = "";
            var stderrBuffer = "";

            this.container.modem.demuxStream(execStream, stdout, stderr);

            execStream.on('finish', function () {
                if (stderrBuffer === "") {
                    resolve(true);
                } else {
                    reject(stderrBuffer)
                }
            })

        })
    }

    /**
     * @param {number} newTimeLimited 
     */
    updateTimelimited(newTimeLimited) {
        this.timeLimited = newTimeLimited;
    }
}

module.exports = LanguageContainer