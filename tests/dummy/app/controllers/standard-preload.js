import Ember from 'ember';
import multiton from 'ember-multiton-service';
import backdrops from 'dummy/ember-theater/fixtures/backdrops';
import characters from 'dummy/ember-theater/fixtures/characters';
import expressions from 'dummy/ember-theater/fixtures/expressions';

const {
  Controller,
  computed,
  getProperties
} = Ember;

export default Controller.extend({
  theaterId: 'standard-preloader',

  fixtureStore: multiton('ember-theater/fixture-store', 'theaterId'),
  preloader: multiton('ember-theater/preloader', 'theaterId'),

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
