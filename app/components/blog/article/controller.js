import m from 'mithril';
import model from './model';


function controller() {
  return {
    data: model(m.route.param('date'), m.route.param('slug'))
  };
}

export default controller;
