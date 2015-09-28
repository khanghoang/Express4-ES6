import BaseExpressConfig from '../app/config/base.express';
import assert from 'assert';

describe('Base Config', function() {
  it('should export function', function() {
    assert.equal(typeof BaseExpressConfig.config, 'function');
  });
});
