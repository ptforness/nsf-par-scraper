module.exports = function (api) {
    api.cache(true);
  
    const presets = [ 
      '@babel/preset-env',
      '@babel/preset-typescript'
   ];
    const plugins = [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-transform-arrow-functions',
      [
        '@babel/plugin-transform-runtime',
        {
          'regenerator': true
        }
      ]
    ];
  
    return {
      presets,
      plugins
    };
  }