# helm-test
[Mocha](https://mochajs.org/) based testing for [Helm](https://github.com/kubernetes/helm) packages!

![logo](screenshots/page-logo.png)

## What does it do?
[Helm](https://github.com/kubernetes/helm) is a great tool for packaging and templating your kubernetes definitions.  However as your templates grow in complexity, and you start to introduce conditionals and other logic it becomes increasingly easy to unwittingly break them.

I wanted to take some of the tooling that I use when coding, and create a simple cli to test the manifest files that helm generates.  `helm-test` will run helm to generate your manifests and then parse the results into JSON for you to perform assertions against.

## How to use it
### Installation
`helm-test` is distributed as a command line interface, simply type `npm install -g helm-test`.  Once you've got that installed, you just need to write some tests.

### Writing tests
Tests should be placed in the root of your helm chart, in a `tests/` folder like so:

```
/
  Chart.yaml
  values.yaml
  charts/
  templates/
  tests/
    your-tests.js
    some-more-tests.js
```

Your test specification follows the popular Mocha layout.  You can see an example [here](examples/service.js)

There are some global helper variables defined for use in your tests:

#### helm
This is the root context and exposes the following functions:

  - `withValueFile(path, [chartName])`: Specify a value file to use when running helm, relative to the root of your chart.  You can call this multiple times
  - `set(key, value)`: Allows you to override a specific value, for example `set('service.port', '80')` would do `--set service.port=80` when running helm
  - `go(done, [chartName])`: Run a helm template generation and parse the output
  - `lint(done, [chartName])`: Run a helm lint

 *`chartName` is an optional parameter but if you want to run helm-test on main folder (against all charts), you need to define 'chartName'*

#### yaml
This global helper function allows you to parse yaml using `yamljs`.  This is useful for scenarios like a configmap containing a string block which sub contains yaml, that you wish to assert on.

eg.
```
const json = yaml.parse(results.ofType('ConfigMap')[0].spec.data);
json.metadata.name.should.eql('some-manifest');
```

#### results
After running `helm.go`, the `results` variable will be populated, and it exposes the following:

  - `length`: The number of manifest files
  - `ofType(type)`: Get all manifests of a given type

### Running your tests
Is a simple as doing `helm-test`:

```
❯ helm-test
  helm-test [info] Welcome to helm-test v0.1.6! +0ms
  helm-test [info] Testing... +0ms


  Helm Chart
    ✓ should have three manifests
    The Service
      ✓ should have standard labels
      ✓ should have valid metadata.name
      ✓ should be a LoadBalancer
      ✓ should be on an internal ip
      ✓ should have a single http-web port
      ✓ should select the right pods
    The StatefulSet
      ✓ should have the right name
      ✓ should have standard labels
      ✓ should have a serviceName
      ✓ should have a single replica
      ✓ should be a RollingUpdate strategy
      ✓ should have matching matchLabels and template labels
      Containers
        ✓ should have two containers
        Master
          ✓ should use the right image
          ✓ should limit 2gig of ram
          ✓ should limit 1.8 CPU
          ✓ should have a http-web port
    The ConfigMap
      ✓ should have standard labels
      ✓ should have valid metadata
      ✓ should have a docker-host key


  21 passing (123ms)

  helm-test [info] Complete. +443ms
```

### Constantly running tests and watching for changes
You can have helm-test run every time it detects a change in your chart by simply doing `helm-test --watch`

### Running tests against all helm charts
You can have helm-test run on main folder to test all charts in subfolder by `helm-test --all` on main folder

## License
Copyright (c) 2017 Karl Stoney
Licensed under the MIT license.
