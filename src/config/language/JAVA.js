

const BaseLanguage = require('./_base.js');

class JavaLanguage extends BaseLanguage {
    setCompileOption() {
        this.compileOption = {
            Cmd: ['javac', '-cp', '".*"', this.baseFileName],
            AttachStdout: true,
            AttachStdin: true,
            AttachStderr: true
        };
    }

    setRunOption() {
        this.runOption = {
            Cmd: ["java", "-Xmx512M", "-Xss64M", "Main"],
            AttachStdout: true,
            AttachStdin: true,
            AttachStderr: true
        }
    }

    setLanguageConfig() {
        this.languageConfig = {
            Image: 'openjdk',
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
    JavaLanguage : JavaLanguage
};
