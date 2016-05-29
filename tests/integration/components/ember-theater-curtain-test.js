import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { $hook, initialize as initializeHook } from 'ember-hook';
import { initialize as initializeMultiton } from 'ember-multiton-service';
import { initialize as initializeTheater } from 'ember-theater';

const { getOwner } = Ember;

moduleForComponent('ember-theater-curtain', 'Integration | Component | ember theater curtain', {
  integration: true,

  beforeEach() {
    const appInstance = getOwner(this);

    initializeHook();
    initializeMultiton(appInstance);
    initializeTheater(appInstance);
  }
});

const configurablePriority = ['config.attrs.curtain', 'config.attrs.globals'];

const attrContainerGenerator = (priority) => {
  const attrContainer = { config: { }, directable: { } };

  priority.split('.').reduce((parentObject, segment) => {
    const childObject = { };

    parentObject[segment] = childObject;

    return childObject;
  }, attrContainer);

  return attrContainer;
}

configurablePriority.forEach((priority) => {
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

    const attrContainer = attrContainerGenerator(priority);

    Ember.set(attrContainer, `${priority}.title`, 'foo');

    this.setProperties({ config: attrContainer.config, translator });

    this.render(hbs`
      {{#ember-theater-curtain config=config translator=translator as |curtain|}}
        <span data-test={{hook "title"}}>{{curtain.title}}</span>
      {{/ember-theater-curtain}}
    `);

    assert.equal($hook('title').text().trim(), translator.map.foo, `title is correct for ${priority}`);
  });
});
