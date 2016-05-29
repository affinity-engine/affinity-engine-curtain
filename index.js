/* jshint node: true */
'use strict';

var path = require('path');

function getParentApp(app) {
  if (typeof app.import !== 'function' && app.app) {
    return getParentApp(app.app);
  } else {
    return app;
  }
}

module.exports = {
  name: 'ember-theater-curtain',

  included: function(app) {
    this._super.included(app);

    this.eachAddonInvoke('safeIncluded', [app]);

    app = getParentApp(app);

    app.import(path.join(app.bowerDirectory, 'PreloadJS/lib/preloadjs-0.6.2.min.js'));
  },

  safeIncluded: function(app, parent) {
    this.included(app, parent);
  }
};
