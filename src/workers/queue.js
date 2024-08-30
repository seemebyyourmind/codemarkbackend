const workerConfig = require("../config/wokers.config");
const { WorkerJob, default: job } = require("./job");

class JobData {
    timeLimited = null;
    memoryLimited = null;
    languageType = null;
    id = null;

    handleRunFinishCallback = null;
    source = null;
    isStore = null;


    constructor(timeLimited, memoryLimited, languageType) {
        this.languageType = languageType;
        this.timeLimited = timeLimited;
        this.memoryLimited = memoryLimited;
        this.id = Math.floor(Math.random() * 1000000) % 1000000;
    }
}

class WorkerQueue {
    /** @type {Array<JobData>} */ queueJob = null;
    /** @type {Array<WorkerJob>} */ workers = null;
    /** @type {number} */ maxWorker = null;

    /**
     * @param {{maxWoker : number}} config 
     */
    constructor(config) {
        this.maxWorker = config.maxWoker;
        this.workers = [];
        this.queueJob = [];
    };

    /**
     * @param {JobData} jobData 
     * @return {WrokerJob}
     */
    createWorker(jobData) {
        if (this.workers.length === this.maxWorker) {
            return;
        }
        let worker = new WorkerJob(
            './src/workers/execute.js',
            {
                workerData: {
                    languageType: jobData.languageType,
                    timeLimited: jobData.timeLimited,
                    workingDirectory: process.cwd() + '/source/' + Math.round(Math.random() * 1000),
                },
            },
            this
        )
        worker.setData(jobData)

        this.workers.push(worker);
        return worker;
    }

    /**
     * @param {JobData} jobData 
     * @param {WorkerJob} worker 
     */
    recreateContainerInWorker(jobData, worker) {
        let workerData = {
            languageType: jobData.languageType,
            timeLimited: jobData.timeLimited,
            workingDirectory: __dirname + '/source/' + Math.round(Math.random() * 1000),
        }
        worker.setData(jobData);
        worker.sendRecreateNewContainer(workerData);
    }

    /**
     * @param {JobData} jobData
     * @return {WorkerJob}
     */
    getAvailableWorker(jobData) {
        if (this.workers.length < this.maxWorker) {
            return this.createWorker(jobData);
        }

        for (let/** @type WorkerJob */ worker of this.workers) {
            if (worker.status === WorkerJob.STATUS.TERMINATE) {
                this.recreateContainerInWorker(jobData, worker);
                return worker;
            }
        }

        for (let /** @type WorkerJob */ worker of this.workers) {
            if (worker.data === null) {
                continue;
            }
            if (jobData.languageType === worker.data.languageType) {
                if (worker.status === WorkerJob.STATUS.AVAILABLE) {
                    worker.setData(jobData);
                    worker.runJob();
                    return worker;
                }
            }
        }

        return this.findContainerAndReplace(jobData);
    }

    /**
     * @param {JobData} jobData 
     */
    findContainerAndReplace(jobData) {
        // Kiểm tra xem có container nào đang bị remove đi vì job hay không
        for (let worker of this.workers) {
            if (worker.status === WorkerJob.STATUS.STOP && worker.data.id === jobData.id) {
                return null;
            }
        }

        // Tìm container đang rảnh và remove
        // Khi thực hiện remove container dành cho một Job nào đó
        // Đính kèm thông tin của Job mới vào Container bị remove
        // Sau đó shift Job mới ra khởi queue để đảm bảo rằng
        // Job mới đó không block các Job khác trong khi chờ được remove
        for (let /** @type WorkerJob */ worker of this.workers) {
            if (worker.status === WorkerJob.STATUS.AVAILABLE) {
                worker.setData(jobData);
                worker.sendStop();
                return worker;
            }
        }

        return null;
    }

    /**
     * Khi thực hiện remove thành công Container dành cho Job
     * nào đó, thực hiện lấy lại data đã được gán vào container để remove
     * Data này chính là Job sẽ được sử dụng vào Container mới
     */
    removeContainer(removedId) {
        for (let i = 0; i < this.workers.length; i++) {
            if (this.workers[i].id === removedId) {
                let data = this.workers[i].data;
                this.queueJob.push(data);
                this.workers[i].setStatus(WorkerJob.STATUS.TERMINATE);
            }
        }
        this.runNextJob();
    }

    /**
     * @param {JobData} job 
     */
    addJob(job) {
        this.queueJob.push(job);
        
        this.runNextJob();
    }

    runNextJob() {
        let nextJob = this.queueJob[0];
        console.log(6)
        if (!nextJob) {
            return;
        }

        let availableWorker = this.getAvailableWorker(nextJob);

        if (!availableWorker) {
            return;
        }

        this.queueJob.shift();
    }
}

var WorkerQueueSingleton = (function () {
    var instance;
   
    function createInstance() {
        instance = new WorkerQueue(workerConfig);

        return instance;
    }

    return {
        /**
         * @returns {WorkerQueue}
         */
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

module.exports = {
    WorkerQueueSingleton: WorkerQueueSingleton,
    JobData: JobData,
    WorkerQueue: WorkerQueue
}