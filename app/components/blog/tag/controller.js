import m from 'mithril';
import utils from 'utils';
import model from './model';


function controller() {
  utils.toggleNavbar('blog');
  return {
    props: model(m.route.param('name'))
  };
}

export default controller;
