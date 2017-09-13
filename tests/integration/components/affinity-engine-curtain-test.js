import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { $hook, initialize as initializeHook } from 'ember-hook';
import { deepStub, initialize as initializeEngine } from 'affinity-engine';

const {
  getProperties,
  getOwner
} = Ember;

moduleForComponent('affinity-engine-curtain', 'Integration | Component | ember engine curtain', {
  integration: true,

  beforeEach() {
    const appInstance = getOwner(this);

    initializeHook();
    initializeEngine(appInstance);
  }
});

const configurationTiers = [
  'config.attrs.component.curtain',
  'config.attrs.all'
];

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

    const stub = deepStub(priority, { attrs: { title: 'foo' } });

    this.setProperties(getProperties(stub, 'config'));
    this.set('translator', translator);

    this.render(hbs`
      {{#affinity-engine engineId="foo" as |engine|}}
        {{#affinity-engine-curtain config=config engineId=engine.engineId translator=translator as |curtain|}}
          <span data-test={{hook "title"}}>{{curtain.title}}</span>
        {{/affinity-engine-curtain}}
      {{/affinity-engine}}
    `);

    assert.equal($hook('title').text().trim(), translator.map.foo, `title is correct for ${priority}`);
  });
});
