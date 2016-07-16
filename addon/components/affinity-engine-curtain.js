import Ember from 'ember';
import layout from '../templates/components/affinity-engine-curtain';
import { ConfigurableMixin, animate, configurable, registrant } from 'affinity-engine';
import multiton from 'ember-multiton-service';

const {
  Component,
  computed,
  get,
  getProperties,
  run,
  set
} = Ember;

const { later } = run;

const { inject: { service } } = Ember;
const { String: { camelize } } = Ember;

const configurationTiers = ['config.attrs.curtain', 'config.attrs.globals'];

export default Component.extend(ConfigurableMixin, {
  layout,

  filesToPreload: '',
  hook: 'affinity_engine_curtain',
  classNames: ['et-curtain'],

  translator: service('affinity-engine/translator'),
  fixtureStore: multiton('affinity-engine/fixture-store', 'engineId'),
  preloader: registrant('affinity-engine/preloader'),

  baseTitle: configurable(configurationTiers, 'title'),
  transitionOut: configurable(configurationTiers, 'transitionOut.effect'),
  transitionOutDuration: configurable(configurationTiers, 'transitionOut.duration', 'transitionDuration'),
  preTransitionOutPauseDuration: configurable(configurationTiers, 'preTransitionOutPauseDuration'),

  title: computed('baseTitle', {
    get() {
      return get(this, 'translator').translate(get(this, 'baseTitle'));
    }
  }),

  init(...args) {
    this._super(...args);

    const {
      filesToPreload,
      fixtureStore,
      preloader
    } = getProperties(this, 'filesToPreload', 'fixtureStore', 'preloader');

    Object.keys(filesToPreload).forEach((fixtureName) => {
      const fixtures = fixtureStore.findAll(camelize(fixtureName));
      const attribute = filesToPreload[fixtureName];

      this._preloadFixtures(preloader, fixtures, attribute);
    });

    preloader.onProgress(({ progress }) => {
      run(() => {
        set(this, 'progress', progress);
      });
    });

    preloader.onComplete(() => {
      run(() => {
        this._complete();
      });
    });
  },

  _preloadFixtures(preloader, fixtures, attribute) {
    fixtures.forEach((fixture) => {
      const src = get(fixture, attribute);
      const id = preloader.idFor(fixture, attribute);

      preloader.loadFile({ src, id });
    });
  },

  _complete() {
    const pauseDuration = get(this, 'preTransitionOutPauseDuration');

    later(() => {
      const effect = get(this, 'transitionOut');
      const duration = get(this, 'transitionOutDuration');

      animate(this.element, effect, { duration }).then(() => {
        run(() => {
          this.attrs.completePreload();
        });
      });
    }, pauseDuration);
  }
});
