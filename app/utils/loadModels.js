import Promise from 'bluebird';
import fs from 'fs';
import path from 'path';
import pluralize from 'pluralize';

let loadModels = async () => {
  let readdirAsync = Promise.promisify(fs.readdir);
  let files = await readdirAsync(path.resolve(__dirname, '../models'));
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let stringFile = path.resolve(__dirname, '../models/', file);
    if (file.indexOf('.js.map') === -1) {
      let modelName = pluralize(file.replace('.js', ''));
      global[modelName] = require(stringFile);
    }
  }

  console.log('finish loading modules');
};

export default loadModels;
