import Ember from 'ember';
import { MultitonService } from 'ember-multiton-service';
import { MultitonIdsMixin } from 'ember-theater';

const {
  get,
  isPresent,
  set
} = Ember;

export default MultitonService.extend(MultitonIdsMixin, {
  init(...args) {
    this._super(...args);

    const queue = new createjs.LoadQueue(true);

    if (isPresent(createjs.Sound)) {
      queue.installPlugin(createjs.Sound);
    }

    set(this, 'queue', queue);
  },

  idFor(fixture, attribute) {
    return `${fixture._type}:${fixture.id}:${attribute}`;
  },

  getElement(id) {
    return get(this, 'queue').getResult(id);
  },

  loadFile(file) {
    get(this, 'queue').loadFile(file);
  },

  onComplete(callback) {
    get(this, 'queue').on('complete', callback);
  },

  onFileLoad(callback) {
    get(this, 'queue').on('fileload', callback);
  },

  onProgress(callback) {
    get(this, 'queue').on('progress', callback);
  }
});
