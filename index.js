/* jshint node: true */
'use strict';

var path = require('path');

function findRoot(current) {
  var app;

  do {
    app = current.app || app;
  } while (current.parent && current.parent.parent && (current = current.parent));

  return app;
}

module.exports = {
  name: 'affinity-engine-curtain',

  treeForAddon: function() {
    var app = findRoot(this);

    app.import(path.join(app.bowerDirectory, 'PreloadJS/lib/preloadjs-0.6.2.min.js'));

    return this._super.treeForAddon.apply(this, arguments);
  }
};
