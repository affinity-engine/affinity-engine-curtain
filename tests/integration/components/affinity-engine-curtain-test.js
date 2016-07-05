import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { $hook, initialize as initializeHook } from 'ember-hook';
import { initialize as initializeEngine } from 'affinity-engine';

const { getOwner } = Ember;

moduleForComponent('affinity-engine-curtain', 'Integration | Component | ember engine curtain', {
  integration: true,

  beforeEach() {
    const appInstance = getOwner(this);

    initializeHook();
    initializeEngine(appInstance);
  }
});

const configurationTiers = ['curtain', 'globals'];

configurationTiers.forEach((priority) => {
  test('it yields a translated title', function(assert) {
    assert.expect(1);

    const translator = {
      map: {
        foo: 'Foo Bar'
      },
      translate(key) {
        return this.map[key];
      }
    };

    const config = {};

    config[priority] = { title: 'foo' };

    this.setProperties({ config, translator });

    this.render(hbs`
      {{#affinity-engine config=config as |engine|}}
        {{#affinity-engine-curtain engineId=engine.engineId translator=translator as |curtain|}}
          <span data-test={{hook "title"}}>{{curtain.title}}</span>
        {{/affinity-engine-curtain}}
      {{/affinity-engine}}
    `);

    assert.equal($hook('title').text().trim(), translator.map.foo, `title is correct for ${priority}`);
  });
});
