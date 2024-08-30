const BaseLanguage = require('./_base');
const { CPPLanguage } = require('./CPP');
const { GOLanguage } = require('./GO');
const { JavaLanguage } = require('./JAVA');

class Language extends BaseLanguage {
}

Language.SUPPORTED = {
  CPP: 'cpp',
  GO: 'golang',
  JAVA : 'java'
};

Language.create = function (type, runningPath) {
  switch (type) {
    case Language.SUPPORTED.CPP:
      return new CPPLanguage(runningPath);

    case Language.SUPPORTED.GO:
      return new GOLanguage(runningPath);

    case Language.SUPPORTED.JAVA:
      return new  JavaLanguage(runningPath);

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

    default:
      return null;
  }
}

module.exports = Language;

