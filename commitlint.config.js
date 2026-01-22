module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: require('./plugins/project/commitlint-plugin-custom').rules,
    },
  ],
  rules: {
    'header-max-length': [2, 'always', 72],
    'header-min-length': [2, 'always', 10],
    'header-match-pattern': [2, 'always'],
    'type-empty': [0, 'never'], // Disable type-empty rule
    'subject-empty': [0, 'never'], // Disable subject-empty rule
    'type-case': [0], // Disable type-case rule (we use custom format)
    'type-enum': [0], // Disable type-enum rule (we use custom format)
    'subject-case': [0], // Disable subject-case rule (we use custom format)
  },
};
