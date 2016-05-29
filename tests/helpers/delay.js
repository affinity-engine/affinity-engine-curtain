import Ember from 'ember';

const { RSVP: { Promise } } = Ember;
const { run: { later } } = Ember;

export default Ember.Test.registerAsyncHelper('delay', function(app, duration) {
  return new Promise((resolve) => {
    later(() => {
      resolve();
    }, duration);
  });
});
