module.exports = {
  description: 'Generates files for ember theater curtain',

  afterInstall: function() {
    var _this = this;
    var packages = [{
      name: 'PreloadJS',
      target: '0.6.1'
    }];

    return this.addBowerPackagesToProject(packages);
  }
};
