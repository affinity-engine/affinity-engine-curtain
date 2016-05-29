import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import { $hook } from 'ember-hook';

moduleForAcceptance('Acceptance | standard preload', {
  beforeEach() {
    Ember.$.Velocity.mock = true;
  },

  afterEach() {
    Ember.$.Velocity.mock = false;
  }
});

test('visiting /standard-preload', function(assert) {
  assert.expect(5);

  visit('/standard-preload').then(() => {
    assert.ok($hook('ember_theater_curtain').length > 0, 'curtain is present');
    assert.equal($hook('title').text().trim(), 'Standard Preload', 'title is correct');

    const progress = parseFloat($hook('progress').text().trim());

    assert.ok(progress > 0, 'progress has started');
    assert.ok(progress < 1, 'progress has not completed');

    return delay(100);
  }).then(() => {
    assert.ok(Ember.$('img').attr('src').indexOf('blob') > -1, 'img is preloaded');
  });
});
