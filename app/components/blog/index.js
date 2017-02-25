import m from 'mithril';
import utils from '../../utils.js';

export default {
  oninit: function(vnode) {
    utils.setTitle('blog');
  },
  view: function(vnode) {
    return m('div', 'blog index');
  }
}
