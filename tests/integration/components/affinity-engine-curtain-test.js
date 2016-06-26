import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { $hook, initialize as initializeHook } from 'ember-hook';
import { initialize as initializeMultiton } from 'ember-multiton-service';
import { deepStub, initialize as initializeTheater } from 'affinity-engine';

const { getOwner } = Ember;

moduleForComponent('affinity-engine-curtain', 'Integration | Component | ember theater curtain', {
  integration: true,

  beforeEach() {
    const appInstance = getOwner(this);

    initializeHook();
    initializeMultiton(appInstance);
    initializeTheater(appInstance);
  }
});

const configurationTiers = ['config.attrs.curtain', 'config.attrs.globals'];

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

    const { config } = deepStub(priority, 'title', 'foo');

    this.setProperties({ config, translator });

    this.render(hbs`
      {{#affinity-engine-curtain config=config translator=translator as |curtain|}}
        <span data-test={{hook "title"}}>{{curtain.title}}</span>
      {{/affinity-engine-curtain}}
    `);

    assert.equal($hook('title').text().trim(), translator.map.foo, `title is correct for ${priority}`);
  });
});
