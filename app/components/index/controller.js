import m from 'mithril';
import model from './model';


function controller() {
  return {
    props: model()
  };
}

export default controller;
