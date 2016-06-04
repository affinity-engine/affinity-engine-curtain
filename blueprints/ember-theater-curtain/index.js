module.exports = {
  description: 'Generates files for ember theater curtain',

  normalizeEntityName: function() {},

  afterInstall: function() {
    var _this = this;
    var packages = [{
      name: 'PreloadJS',
      target: '0.6.2'
    }, {
      name: 'SoundJS',
      target: '0.6.2'
    }];

    return this.addBowerPackagesToProject(packages);
  }
};
