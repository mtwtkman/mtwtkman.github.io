import m from 'mithril';
import utils from 'utils';
import model from './model';


function controller() {
  utils.toggleNavbar('blog');
  return {
    data: model(m.route.param('date'), m.route.param('slug'))
  };
}

export default controller;
