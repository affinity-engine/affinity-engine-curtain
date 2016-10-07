import Ember from 'ember';
import { registrant } from 'affinity-engine';
import multiton from 'ember-multiton-service';
import keyframes from 'dummy/affinity-engine/fixtures/keyframes';

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
    title: 'Standard Preload',
    plugin: {
      curtain: {
        preTransitionOutPauseDuration: 0
      }
    }
  },

  fixtures: {
    keyframes
  },

  preloadedImage: computed({
    get() {
      const { fixtureStore, preloader } = getProperties(this, 'fixtureStore', 'preloader');
      const fixture = fixtureStore.find('keyframes', 'classroom');
      const id = preloader.idFor(fixture, 'src');

      return preloader.getElement(id, false);
    }
  }).readOnly()
});
