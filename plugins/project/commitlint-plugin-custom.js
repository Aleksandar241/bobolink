const headerPattern = /^(BBLK): (Task|Chore|Bug|Refactor|Fix) - .+$/;

module.exports = {
  rules: {
    'header-match-pattern': ({ header }) => {
      if (headerPattern.test(header)) {
        return [true];
      }
      return [
        false,
        'header must be in format "BBLK: Task|Chore|Bug|Refactor|Fix - some message here"',
      ];
    },
  },
};
