module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: [
    "react",
    "react-hooks",
    'react-refresh'],
  rules: {
    "no-console": "error",
        "no-restricted-syntax": [
            "error",
            {
                "selector": "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
                "message": "Unexpected property on console object was called"
            }
        ],
    "linebreak-style": "off",
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "off", // Checks effect dependencies
    "react/jsx-one-expression-per-line": 0,
    "react/react-in-jsx-scope": 0,
    "react/function-component-definition": 0,
    "arrow-body-style": 0,
    "import/prefer-default-export": 0,
    "react/prop-types": 0,
    "no-unused-vars": 1,
    "no-spaced-func": 2,
    "no-trailing-spaces": 2,
    "import/no-unresolved": 0, //TODO: need to fix
    "comma-dangle": [
        "error",
        "never"
    ],
    "import/extensions": 0,
    "react/jsx-props-no-spreading": 0,
    "react/button-has-type": 0,
    "max-len": 0
}
}
