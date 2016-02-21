import _ from 'lodash';
import yamlIndexes from 'raw!../articles/index.txt';


function toggleNavbar(hash) {
  _.each(document.getElementsByClassName('navbar-nav')[0].children, li => {
    if (li.id.replace('nav-', '') === hash) {
      li.className = 'active';
    } else {
      li.className = '';
    }
  });
}

function parseYaml() {
  return _.compact(yamlIndexes.split('\n').map(yamlPath => {
    let article = require(`json!yaml!../articles/${yamlPath}`);
    if (article.publish) return article;
  }));
}

export default {
  toggleNavbar,
  parseYaml
};
