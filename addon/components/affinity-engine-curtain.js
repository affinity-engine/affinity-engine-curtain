import Ember from 'ember';
import layout from '../templates/components/affinity-engine-curtain';
import { ConfigurableMixin, configurable, registrant } from 'affinity-engine';
import multiton from 'ember-multiton-service';

const {
  Component,
  computed,
  get,
  getProperties,
  run,
  set
} = Ember;

const { next } = run;
const { String: { camelize } } = Ember;

const configurationTiers = [
  'config.attrs.component.curtain',
  'config.attrs.global'
];

export default Component.extend(ConfigurableMixin, {
  layout,

  filesToPreload: '',
  hook: 'affinity_engine_curtain',
  classNames: ['et-curtain'],

  config: multiton('affinity-engine/config', 'engineId'),
  eBus: multiton('message-bus', 'engineId'),
  fixtureStore: multiton('affinity-engine/fixture-store', 'engineId'),
  preloader: registrant('affinity-engine/preloader'),
  translator: registrant('affinity-engine/translator'),

  baseTitle: configurable(configurationTiers, 'title'),

  title: computed('baseTitle', {
    get() {
      const title = get(this, 'baseTitle');

      return get(this, 'translator').translate(title) || title;
    }
  }),

  init(...args) {
    this._super(...args);

    const {
      eBus,
      filesToPreload,
      fixtureStore,
      preloader
    } = getProperties(this, 'eBus', 'filesToPreload', 'fixtureStore', 'preloader');

    let preloadableFilesArePresent = false;

    Object.keys(filesToPreload).forEach((fixtureName) => {
      const fixtures = fixtureStore.findAll(camelize(fixtureName));
      const attribute = filesToPreload[fixtureName];

      this._preloadFixtures(preloader, fixtures, attribute);

      if (fixtures.length > 0) { preloadableFilesArePresent = true; }
    });

    eBus.subscribe('preloadProgress', this, this._setProgress);
    eBus.subscribe('preloadCompletion', this, this._complete);

    if (!preloadableFilesArePresent) { this._complete(); }
  },

  _preloadFixtures(preloader, fixtures, attribute) {
    fixtures.forEach((fixture) => {
      const src = get(fixture, attribute);
      const id = preloader.idFor(fixture, attribute);

      preloader.loadFile({ src, id });
    });
  },

  _setProgress({ progress }) {
    set(this, 'progress', progress);
  },

  _complete() {
    next(() => get(this, 'eBus').publish('readyToRunGame'));
  }
});
