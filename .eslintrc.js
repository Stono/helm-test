'use strict';

module.exports = {
  root: true,
  globals: {
    IGrunt: 'readable',
    NodeJS: 'readable',
    Mocha: 'readable'
  },
  env: {
    es2020: true,
    node: true,
    mocha: true,
    jquery: true
  },
  parserOptions: {
    project: 'tsconfig.json',
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  settings: {
    'import/extensions': ['.js', '.ts', '.tsx'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.tsx']
      }
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:mocha/recommended',
    'prettier',
    'plugin:promise/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'prettier',
    'mocha',
    'promise',
    'import',
    'no-only-tests',
    'eslint-comments'
  ],
  overrides: [
    {
      files: ['tasks/**', 'lib/**', 'bin/**'],
      rules: {
        'no-restricted-imports': ['off']
      }
    },
    {
      files: ['test/**/*.ts', 'test/**/*.ts'],
      rules: {
        'max-classes-per-file': 'off'
      }
    }
  ],
  rules: {
    'no-only-tests/no-only-tests': 'error',
    '@typescript-eslint/require-array-sort-compare': [
      'error',
      { ignoreStringArrays: true }
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['.*'],
            message:
              'Use of relative paths (./) is not allowed.  Use ts-config resolved paths (lib/)'
          }
        ]
      }
    ],
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'explicit',
        overrides: {
          accessors: 'explicit',
          constructors: 'off',
          methods: 'explicit',
          properties: 'explicit',
          parameterProperties: 'explicit'
        }
      }
    ],
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/no-require-imports': 'error',
    'import/no-default-export': 'error',
    'promise/no-callback-in-promise': 'off',
    'no-useless-catch': 'error',
    '@typescript-eslint/no-duplicate-imports': 'error',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: true
      }
    ],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: true
      }
    ],
    'prettier/prettier': 'error',
    'accessor-pairs': 'error',
    'array-bracket-newline': 'off',
    'array-bracket-spacing': 'error',
    'array-callback-return': 'error',
    'array-element-newline': ['warn', 'consistent'],
    'arrow-body-style': 'off',
    'arrow-parens': 'error',
    'arrow-spacing': 'error',
    'block-scoped-var': 'error',
    'block-spacing': 'error',
    'brace-style': ['off', '1tbs'],
    'callback-return': 'off',
    camelcase: 'off',
    'capitalized-comments': 'off',
    'class-methods-use-this': 'off',
    'comma-dangle': 'error',
    'comma-spacing': [
      'error',
      {
        after: true,
        before: false
      }
    ],
    'comma-style': 'error',
    complexity: 'error',
    'computed-property-spacing': 'error',
    'consistent-return': 'error',
    'consistent-this': 'warn',
    curly: 'error',
    'default-case': 'error',
    'dot-location': ['error', 'property'],
    'dot-notation': 'error',
    'eol-last': 'error',
    eqeqeq: 'error',
    'eslint-comments/no-unused-disable': 'error',
    'for-direction': 'error',
    'func-call-spacing': 'error',
    'func-name-matching': 'error',
    'func-names': ['error', 'never'],
    'func-style': [
      'error',
      'declaration',
      {
        allowArrowFunctions: true
      }
    ],
    'function-paren-newline': 'off',
    'generator-star-spacing': 'error',
    'getter-return': 'error',
    'global-require': 'off',
    'guard-for-in': 'error',
    'handle-callback-err': 'error',
    'id-blacklist': 'error',
    'id-length': ['off', { exceptions: ['_'] }],
    'id-match': 'error',
    'implicit-arrow-linebreak': 'off',
    indent: 'off',
    'indent-legacy': 'off',
    'init-declarations': 'off',
    'jsx-quotes': 'error',
    'key-spacing': 'error',
    'keyword-spacing': [
      'error',
      {
        after: true,
        before: true
      }
    ],
    'max-classes-per-file': ['error', 1],
    'line-comment-position': 'error',
    'linebreak-style': ['error', 'unix'],
    'lines-around-comment': 'off',
    'lines-around-directive': 'off',
    'lines-between-class-members': 'off',
    '@typescript-eslint/member-ordering': ['error'],
    'max-depth': 'error',
    'max-len': 'off',
    'max-lines': 'off',
    'max-nested-callbacks': 'error',
    'max-params': ['error', 10],
    'max-statements': ['warn', 30],
    'max-statements-per-line': 'error',
    'multiline-comment-style': 'off',
    'multiline-ternary': 'off',
    'new-cap': 'off',
    'new-parens': 'error',
    'newline-after-var': ['off', 'always'],
    'newline-before-return': 'off',
    'newline-per-chained-call': 'off',
    'no-alert': 'error',
    'no-console': 'off',
    'no-array-constructor': 'error',
    'no-await-in-loop': 'off',
    'no-bitwise': 'error',
    'no-buffer-constructor': 'error',
    'no-caller': 'error',
    'no-catch-shadow': 'error',
    'no-confusing-arrow': 'warn',
    'no-continue': 'error',
    'no-div-regex': 'error',
    'no-duplicate-imports': 'off',
    'no-else-return': 'error',
    'no-empty-function': 'off',
    'no-eq-null': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    'no-extra-parens': 'off',
    'no-floating-decimal': 'error',
    'no-implicit-coercion': 'error',
    'no-implicit-globals': 'error',
    'no-implied-eval': 'error',
    'no-inline-comments': 'error',
    'no-invalid-this': 'error',
    'no-iterator': 'error',
    'no-label-var': 'error',
    'no-labels': 'error',
    'no-lone-blocks': 'error',
    'no-lonely-if': 'error',
    'no-loop-func': 'error',
    'no-magic-numbers': 'off',
    'no-mixed-operators': 'error',
    'no-mixed-requires': 'error',
    'no-multi-assign': 'error',
    'no-multi-spaces': 'off',
    'no-multi-str': 'error',
    'no-multiple-empty-lines': 'error',
    'no-native-reassign': 'error',
    'no-negated-condition': 'error',
    'no-negated-in-lhs': 'error',
    'no-nested-ternary': 'error',
    'no-new': 'error',
    'no-new-func': 'error',
    'no-new-object': 'error',
    'no-new-require': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-param-reassign': ['error', { props: false }],
    'no-path-concat': 'error',
    'no-plusplus': 'error',
    'no-process-env': 'off',
    'no-process-exit': 'off',
    'no-proto': 'error',
    'no-prototype-builtins': 'error',
    'no-restricted-globals': 'error',
    'no-restricted-modules': 'error',
    'no-restricted-properties': 'error',
    'no-restricted-syntax': 'error',
    'no-return-assign': 'error',
    'no-return-await': 'error',
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'no-shadow-restricted-names': 'error',
    'no-spaced-func': 'error',
    'no-sync': 'off',
    'no-tabs': 'error',
    'no-template-curly-in-string': 'error',
    'no-ternary': 'off',
    'no-throw-literal': 'error',
    'no-trailing-spaces': 'error',
    'no-undef': 'error',
    'no-undef-init': 'error',
    'no-undefined': 'warn',
    'no-underscore-dangle': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unneeded-ternary': 'error',
    'no-unused-expressions': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-use-before-define': 'error',
    'no-useless-call': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    'no-useless-constructor': 'error',
    'no-useless-rename': 'error',
    'no-useless-return': 'error',
    'no-var': 'off',
    'no-void': 'error',
    'no-warning-comments': 'warn',
    'no-whitespace-before-property': 'error',
    'no-with': 'error',
    'nonblock-statement-body-position': 'error',
    'object-curly-newline': 'error',
    'object-curly-spacing': ['error', 'always'],
    'object-property-newline': ['warn', { allowAllPropertiesOnSameLine: true }],
    'object-shorthand': 'error',
    'one-var': 'off',
    'one-var-declaration-per-line': 'error',
    'operator-assignment': 'error',
    'operator-linebreak': 'error',
    'padded-blocks': 'off',
    'padding-line-between-statements': 'error',
    'prefer-arrow-callback': 'off',
    'prefer-const': 'error',
    'prefer-destructuring': 'off',
    'prefer-numeric-literals': 'error',
    'prefer-promise-reject-errors': 'error',
    'prefer-reflect': 'off',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'quote-props': 'off',
    quotes: 'off',
    radix: 'error',
    'require-await': 'off',
    'require-jsdoc': [
      'off',
      {
        require: {
          FunctionDeclaration: false,
          MethodDefinition: true,
          ClassDeclaration: false,
          ArrowFunctionExpression: false,
          FunctionExpression: false
        }
      }
    ],
    'rest-spread-spacing': 'error',
    semi: 'off',
    'semi-spacing': 'error',
    'semi-style': 'off',
    'sort-imports': 'off',
    'sort-keys': 'off',
    'sort-vars': 'error',
    'space-before-blocks': 'error',
    'space-before-function-paren': 'off',
    'space-in-parens': ['error', 'never'],
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',
    'spaced-comment': 'error',
    strict: 'error',
    'switch-colon-spacing': 'error',
    'symbol-description': 'error',
    'template-curly-spacing': ['error', 'never'],
    'template-tag-spacing': 'error',
    'unicode-bom': ['error', 'never'],
    'valid-jsdoc': 'off',
    'vars-on-top': 'error',
    'wrap-iife': 'error',
    'wrap-regex': 'error',
    'yield-star-spacing': 'error',
    yoda: 'error',

    // typescript-eslint rules
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-empty-function': 'off',

    // eslint-plugin-mocha rules
    'mocha/handle-done-callback': 'error',
    'mocha/max-top-level-suites': ['error', { limit: 1 }],
    'mocha/no-async-describe': 'error',
    'mocha/no-exclusive-tests': 'warn',
    'mocha/no-global-tests': 'error',
    'mocha/no-hooks': 'off',
    'mocha/no-hooks-for-single-case': 'off',
    'mocha/no-identical-title': 'error',
    'mocha/no-mocha-arrows': 'off',
    'mocha/no-nested-tests': 'error',
    'mocha/no-pending-tests': 'warn',
    'mocha/no-return-and-callback': 'error',
    'mocha/no-return-from-async': 'off',
    'mocha/no-setup-in-describe': 'off',
    'mocha/no-sibling-hooks': 'error',
    'mocha/no-skipped-tests': 'warn',
    'mocha/no-synchronous-tests': 'off',
    'mocha/no-top-level-hooks': 'off',
    'mocha/prefer-arrow-callback': 'off',
    'mocha/valid-suite-description': 'off',
    'mocha/valid-test-description': 'off'
  }
};
