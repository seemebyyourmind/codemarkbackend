const BaseLanguage = require('./_base');
const { CPPLanguage } = require('./CPP');
const { GOLanguage } = require('./GO');
const { JavaLanguage } = require('./JAVA');
const {PythonLanguage}=require('./PYTHON')

class Language extends BaseLanguage {
}

Language.SUPPORTED = {
  CPP: 'cpp',
  GO: 'golang',
  JAVA : 'java',
  PYTHON:'python'
};

Language.create = function (type, runningPath) {
  switch (type) {
    case Language.SUPPORTED.CPP:
      return new CPPLanguage(runningPath);

    case Language.SUPPORTED.GO:
      return new GOLanguage(runningPath);

    case Language.SUPPORTED.JAVA:
      return new  JavaLanguage(runningPath);
    case Language.SUPPORTED.PYTHON:
        return new PythonLanguage(runningPath);
    default:
      return null;
  }
};

Language.getFileName = function(type) {
  switch (type) {
    case Language.SUPPORTED.CPP:
      return "A.cpp";

    case Language.SUPPORTED.GO:
      return "A.go";

    case Language.SUPPORTED.JAVA:
      return "A.java";
    case Language.SUPPORTED.PYTHON:
        return "A.py";
    default:
      return null;
  }
}

module.exports = Language;

