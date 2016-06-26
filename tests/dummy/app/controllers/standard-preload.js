import Ember from 'ember';
import multiton from 'ember-multiton-service';
import backdrops from 'dummy/affinity-engine/fixtures/backdrops';
import characters from 'dummy/affinity-engine/fixtures/characters';
import expressions from 'dummy/affinity-engine/fixtures/expressions';

const {
  Controller,
  computed,
  getProperties
} = Ember;

export default Controller.extend({
  engineId: 'standard-preloader',

  fixtureStore: multiton('affinity-engine/fixture-store', 'engineId'),
  preloader: multiton('affinity-engine/preloader', 'engineId'),

  config: {
    globals: {
      title: 'Standard Preload'
    },
    curtain: {
      preTransitionOutPauseDuration: 0
    }
  },

  fixtures: {
    backdrops,
    characters,
    expressions
  },

  preloadedImage: computed({
    get() {
      const { fixtureStore, preloader } = getProperties(this, 'fixtureStore', 'preloader');
      const fixture = fixtureStore.find('backdrops', 'classroom');
      const id = preloader.idFor(fixture, 'src');

      return preloader.getElement(id);
    }
  }).readOnly()
});
