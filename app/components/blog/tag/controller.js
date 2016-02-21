import m from 'mithril';
import model from './model';


function controller() {
  return {
    props: model(m.route.param('name'))
  };
}

export default controller;
