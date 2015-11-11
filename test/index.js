const { expect } = require('chai');

describe('TemplateSuite', function testSuite() {
  before(function loadModule() {
    this.render = require('../src');
  });

  it('should reject promise on an unknown template', function test() {
    return this.render('unknown')
      .reflect()
      .then(function inspectError(promise) {
        expect(promise.isRejected()).to.be.eq(true);
        expect(promise.reason().name).to.be.eq('NotFoundError');
      });
  });

  it('should reject promise on invalid context', function test() {
    return this.render('activate', null)
      .reflect()
      .then(function inspectError(promise) {
        expect(promise.isRejected()).to.be.eq(true);
        expect(promise.reason().name).to.be.eq('TypeError');
      });
  });

  it('should return rendered template on valid context and existing template', function test() {
    return this.render('activate', { username: 'vasya', link: 'http://localhost', qs: '?test=ok' })
      .reflect()
      .then(function inspectError(promise) {
        expect(promise.isRejected()).to.be.eq(false);
        expect(promise.isFulfilled()).to.be.eq(true);
        expect(promise.value()).to.match(/Dear vasya, please/m);
      });
  });

  it('should return rendered template on valid context and existing template with missing username', function test() {
    return this.render('activate', { link: 'http://localhost', qs: '?test=ok' })
      .reflect()
      .then(function inspectError(promise) {
        expect(promise.isRejected()).to.be.eq(false);
        expect(promise.isFulfilled()).to.be.eq(true);
        expect(promise.value()).to.match(/Please follow/m);
      });
  });
});
