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
  
  describe('The Service', () => {
    let service;
    before(() => {
      service = results.ofType('Service')[0];
    });
    it('should be a LoadBalancer', () => {
      service.spec.type.should.eql('LoadBalancer');
    });
    it('should be on an internal ip', () => {
      service.metadata.annotations['cloud.google.com/load-balancer-type'].should.eql('Internal');
    });
  });

  describe('The ConfigMap', () => {
     let map;
    before(() => {
      map = results.ofType('ConfigMap')[0];
    });
    it('should have valid metadata', () => {
      const expectedMetadata = { name: 'platform-image-builder' };
      map.metadata.should.eql(expectedMetadata); 
    });
    it('should have a docker-host key', () => {
      map.data['docker-host'].should.eql('tcp://127.0.0.1:2375');
    });
  });
});
