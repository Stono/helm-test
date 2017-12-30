'use strict';
describe('Helm Chart', () => {
  before(done => {
    helm
    .withValueFile('values.yaml')
    .go(done);
  });

  it('should have three manifests', () => {
    results.length.should.eql(3);
    results.ofType('Service').length.should.eql(1);
    results.ofType('ConfigMap').length.should.eql(1);
    results.ofType('StatefulSet').length.should.eql(1);
  });

  const standardLabels = {
    app: 'platform-image-builder',
    version: '1',
    heritage: 'Tiller',
    release: 'RELEASE-NAME',
    chart: 'helm-platform-image-builder-0.1.0'
  };

  describe('The Service', () => {
    let service;
    before(() => {
      service = results.ofType('Service')[0];
    });
    it('should have standard labels', () => {
      service.metadata.labels.should.eql(standardLabels);
    });
    it('should have valid metadata.name', () => {
      service.metadata.name.should.eql('platform-image-builder-service');
    });
    it('should be a LoadBalancer', () => {
      service.spec.type.should.eql('LoadBalancer');
    });
    it('should be on an internal ip', () => {
      service.metadata.annotations['cloud.google.com/load-balancer-type'].should.eql('Internal');
    });
    it('should have a single http-web port', () => {
      service.spec.ports.length.should.eql(1);
      const port = service.spec.ports[0];
      port.name.should.eql('http-web');
      port.port.should.eql(80);
      port.targetPort.should.eql('http-web');
    });
    it('should select the right pods', () => {
      service.spec.selector.should.eql({
        app: 'platform-image-builder'
      });
    });
  });

  describe('The StatefulSet', () => {
    let set;
    before(() => {
      set = results.ofType('StatefulSet')[0];
    });
    it('should have the right name', () => {
      set.metadata.name.should.eql('platform-image-builder');
    });
    it('should have standard labels', () => {
      set.metadata.labels.should.eql(standardLabels);
    });
    it('should have a serviceName', () => {
      set.spec.serviceName.should.eql('platform-image-builder-headless');
    });
    it('should have a single replica', () => {
      set.spec.replicas.should.eql(1);
    });
    it('should be a RollingUpdate strategy', () => {
      set.spec.updateStrategy.type.should.eql('RollingUpdate');
    });
    it('should have matching matchLabels and template labels', () => {
      const matchLabels = set.spec.selector.matchLabels;
      const templateLabels = set.spec.template.metadata.labels;
      matchLabels.should.eql(templateLabels);
    });
    describe('Containers', () => {
      let containers, master;
      before(() => {
        containers = set.spec.template.spec.containers;
        master = containers.find(x => { return x.name === 'master'; });
      });
      it('should have two containers', () => {
        containers.length.should.eql(2);
      });
      describe('Master', () => {
        it('should use the right image', () => {
          master.image.should.eql('eu.gcr.io/k8-discovery-185615/platform-image-builder:latest');
        });
        it('should limit 2gig of ram', () => {
          master.resources.limits.memory.should.eql('2048Mi');
        });
        it('should limit 1.8 CPU', () => {
          master.resources.limits.cpu.should.eql('1800m');
        });
        it('should have a http-web port', () => {
          const port = master.ports.find(x => { return x.name === 'http-web'; });
          port.containerPort.should.eql(8080);
        });
      });
    });
  });

  describe('The ConfigMap', () => {
    let map;
    before(() => {
      map = results.ofType('ConfigMap')[0];
    });
    it('should have standard labels', () => {
      map.metadata.labels.should.eql(standardLabels);
    });
    it('should have valid metadata', () => {
      map.metadata.name.should.eql('platform-image-builder');
    });
    it('should have a docker-host key', () => {
      map.data['docker-host'].should.eql('tcp://127.0.0.1:2375');
    });
  });
});
