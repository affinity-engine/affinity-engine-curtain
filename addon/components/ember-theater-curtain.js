import Ember from 'ember';
import layout from '../templates/components/ember-theater-curtain';
import { ConfigurableMixin, animate, configurable } from 'ember-theater';
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

const configurablePriority = ['config.attrs.curtain', 'config.attrs.globals'];

export default Component.extend(ConfigurableMixin, {
  layout,

  filesToPreload: '',
  hook: 'ember_theater_curtain',
  classNames: ['et-curtain'],

  translator: service('ember-theater/translator'),
  fixtureStore: multiton('ember-theater/fixture-store', 'theaterId'),
  preloader: multiton('ember-theater/preloader', 'theaterId'),

  baseTitle: configurable(configurablePriority, 'title'),
  transitionOut: configurable(configurablePriority, 'transitionOut.effect'),
  transitionOutDuration: configurable(configurablePriority, 'transitionOut.duration', 'transitionDuration'),
  preTransitionOutPauseDuration: configurable(configurablePriority, 'preTransitionOutPauseDuration'),

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
