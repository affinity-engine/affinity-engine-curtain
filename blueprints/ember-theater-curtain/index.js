module.exports = {
  description: 'Generates files for ember theater curtain',

  afterInstall: function() {
    var packages = [{
      name: 'PreloadJS',
      target: '0.6.2'
    }];

    return this.addBowerPackagesToProject(packages);
  }
};
