import _ from 'lodash';
import yamlIndexes from 'raw!../articles/index.txt';


function parseYaml() {
  return _.compact(yamlIndexes.split('\n').map(yamlPath => {
    let article = require(`json!yaml!../articles/${yamlPath}`);
    if (article.publish) return article;
  }));
}

export default {parseYaml};
