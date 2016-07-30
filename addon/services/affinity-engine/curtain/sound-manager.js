import Ember from 'ember';
import { MultitonIdsMixin } from 'affinity-engine';
import { BusSubscriberMixin } from 'ember-message-bus';
import multiton from 'ember-multiton-service';

const {
  Service,
  computed,
  get,
  isBlank,
  set
} = Ember;

export default Service.extend(BusSubscriberMixin, MultitonIdsMixin, {
  config: multiton('affinity-engine/config', 'engineId'),

  idMap: computed(() => Ember.Object.create()),

  init(...args) {
    this._super(...args);

    const engineId = get(this, 'engineId');

    this.on(`ae:${engineId}:shouldResetEngine`, this, this.clearSounds);
  },

  findOrCreateInstance(soundId, instanceId = 0) {
    const instance = get(this, `idMap.${soundId}.${instanceId}`);

    return instance || this._createInstance(soundId, instanceId);
  },

  _createInstance(soundId, instanceId) {
    const idMap = get(this, 'idMap');

    if (isBlank(get(idMap, soundId))) {
      set(idMap, soundId, Ember.Object.create());
    }

    const instance = createjs.Sound.createInstance(soundId);

    return set(idMap, `${soundId}.${instanceId}`, instance);
  },

  clearSounds() {
    const idMap = get(this, 'idMap');

    Object.keys(idMap).forEach((mapKey) => {
      const map = get(idMap, mapKey);

      Object.keys(map).forEach((instanceKey) => {
        get(map, instanceKey).stop();
      });
    });

    set(this, 'idMap', Ember.Object.create());
  }
});
