const fs = require('fs');

if (global && !global.Rev) {
  const baseDir = __dirname + "/";
  const load = function () {
    try {
      const fileName = baseDir + 'manifest.json';
      if (fs.existsSync(fileName)) {
        return JSON.parse(fs.readFileSync(fileName));
      }
      console.log('[INFO]Resource manifest not found');
      return null;
    } catch (e) {
      console.log('[ERROR]Load resource manifest failed:');
      console.log(e);
      return null;
    }
  };
  const resourceMap = load();

  global.Rev = {
    loadResource: function (name) {
      if (!resourceMap) return null;
      return resourceMap[name];
    },

    loadConfig: function (configName) {
      let jsName = baseDir + 'config/' + configName + '.js';
      if (require('fs').existsSync(jsName)) {
        return require(jsName);
      } else {
        console.log(`[ERROR]Config "${jsName}" not found`);
        return null;
      }
    }

  };
} else {
  console.log('global object not found');
}