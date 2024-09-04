const BaseLanguage = require('./_base.js');

class PythonLanguage extends BaseLanguage {
    setCompileOption() {
        // Python không cần biên dịch, nên ta để trống phương thức này
        this.compileOption = null;
    }

    setRunOption() {
        this.runOption = {
            Cmd: ['python3', this.baseFileName],
            AttachStdout: true,
            AttachStdin: true,
            AttachStderr: true
        }
    }

    setLanguageConfig() {
        this.languageConfig = {
            Image: 'python:3.10-slim', // Sử dụng image Python 3.9, bạn có thể thay đổi version nếu cần
            Tty: true,
            HostConfig: {
                // Binds: [`${this.baseDirectory}:/source`],
                Memory: 256 * 1024 * 1024,
                NanoCPUs: 1000000000, // Số lượng CPU ảo (2 CPU ảo)
            },
            WorkingDir: '/source',
            OpenStdin: true,
            AttachStdin: true,
        }
    }
}

module.exports = {
    PythonLanguage: PythonLanguage
}