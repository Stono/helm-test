require('grunt');

const config: {
  targets: { lib: string[]; test: string[]; all: string[] };
  timeout: number;
  require: string[];
} = {
  targets: {
    lib: ['lib/*.ts'],
    test: ['test/**/*.ts'],
    all: []
  },
  timeout: 5000,
  require: ['ts-node/register', 'tsconfig-paths/register', 'should']
};
config.targets.all = config.targets.lib.concat(config.targets.test);

const tsConfig = {
  default: {
    options: {
      fast: 'always',
      verbose: true
    },
    tsconfig: './tsconfig.build.json'
  }
};

const mochaConfig = {
  stdout: {
    options: {
      reporter: 'spec',
      timeout: config.timeout,
      require: config.require
    },
    src: config.targets.test
  }
};

const eslintConfig = {
  options: {
    overrideConfigFile: '.eslintrc.js'
  },
  target: config.targets.all
};

const execConfig = {
  //rm -rf ./built &&
  clean: 'rm -rf ./compiled && rm -rf .tscache',
  start: './node_modules/.bin/ts-node index.ts',
  rename: 'mv built/bin/helm-test.js built/bin/helm-test'
};

const copyConfig = {
  config: {
    expand: true,
    cwd: '.',
    src: ['package.json'],
    dest: 'built/'
  }
};

module.exports = function (grunt: any) {
  grunt.initConfig({
    eslint: eslintConfig,
    ts: tsConfig,
    mochaTest: mochaConfig,
    exec: execConfig,
    copy: copyConfig,
    env: {
      default: {
        TESTING: 'true'
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-eslint');

  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('test', ['env:default', 'mochaTest']);
  grunt.registerTask('build', ['exec:clean', 'ts', 'copy', 'exec:rename']);
  grunt.registerTask('default', ['lint', 'test', 'build']);
};
