import m from 'mithril'
import yaml from 'js-yaml'

import utils from '../../utils.js'

const Tag = {
  data: [],
  fetch: function(tag) {
    m.request({
      method: 'GET',
      url: '/articles/tagging.yml',
      deserialize: yaml.safeLoad
    })
    .then(function(response) {
      Tag.data = response[tag];
    });
  }
};

export default {
  oninit: function(vnode) {
    utils.setTitle(`tug: ${vnode.attrs.name}`);
    Tag.fetch(vnode.attrs.name);
  },
  view: function(vnode) {
    return m('div', [
      m('div#tag-header', m('h2', [
        m('span.glyphicon.glyphicon-tag[aria-hidden="true"]'),
        vnode.attrs.name
      ])),
      m('div#tag-list', Tag.data.map(tag => {
        return m('div',
          m('a', {
            href: `/blog/article/${tag.path}`,
            oncreate: m.route.link,
          }, tag.title)
        );
      }))
    ]);
  }
}
