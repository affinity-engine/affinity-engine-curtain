import Ember from 'ember';
import { registrant } from 'affinity-engine';
import multiton from 'ember-multiton-service';
import backdrops from 'dummy/affinity-engine/fixtures/backdrops';

const {
  Controller,
  computed,
  getProperties
} = Ember;

export default Controller.extend({
  engineId: 'standard-preloader',

  fixtureStore: multiton('affinity-engine/fixture-store', 'engineId'),
  preloader: registrant('affinity-engine/preloader'),

  config: {
    globals: {
      title: 'Standard Preload'
    },
    curtain: {
      preTransitionOutPauseDuration: 0
    }
  },

  fixtures: {
    backdrops
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
