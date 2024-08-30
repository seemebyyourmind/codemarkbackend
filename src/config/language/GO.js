
const BaseLanguage = require('./_base.js');

class GOLanguage extends BaseLanguage {
    setCompileOption() {
        this.compileOption = {
            Cmd: ['go', 'build', '-o', 'A', this.baseFileName],
            AttachStdout: true,
            AttachStdin: true,
            AttachStderr: true
        };
    }

    setRunOption() {
        this.runOption = {
            Cmd: ['./A'],
            AttachStdout: true,
            AttachStdin: true,
            AttachStderr: true
        }
    }

    setLanguageConfig() {
        this.languageConfig = {
            Image: 'golang:1.19.5',
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
    GOLanguage: GOLanguage
}

