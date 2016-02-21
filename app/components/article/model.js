import utils from '../../utils';
import _ from 'lodash';


function model(date, slug) {
  let data = utils.parseYaml();
  let target = _.compact(data.map(d => {
    if (d.date.split(' ')[0] === date && d.slug === slug) {
      return d;
    }
  }));
  return target[0];
}

export default model;
