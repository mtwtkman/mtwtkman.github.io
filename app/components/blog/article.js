import m from 'mithril'
import yaml from 'js-yaml'
import marked from 'marked'

import utils from '../../utils.js';


const Article = {
  data: {
    title: '',
    tags: [],
    date: '',
    body: '',
  },
  fetch: function(args) {
    m.request({
      method: 'GET',
      url: `/articles/${args.year}/${args.month}/${args.day}/${args.title}.yml`,
      deserialize: yaml.safeLoad
    })
    .then(function(response) {
      Article.data.title = response.title;
      Article.data.tags = response.tags;
      Article.data.date = response.date;
      Article.data.body = response.body;
    });
  }
};

export default {
  oninit: function(vnode) {
    marked.setOptions({
      gfm: true,
      tables: true,
      smartLists: true
    });
    let attrs = vnode.attrs;
    utils.setTitle(attrs.title);
    Article.fetch(attrs);
  },
  view: function(vnode) {
    const data = Article.data;
    return m('section', [
      m('header', [
        m('h1', data.title),
        m('div#article-date', [
          m('span.glyphicon.glyphicon-time[aria-hidden="true"]'),
          m('span', data.date),
        ]),
        m('div#tags', data.tags.map(tag => {
          return m(
            'span.tag',
            m(`a[href='/blog/tag/${tag}`,
              {oncrate: m.route.link},
              [m('span.glyphicon.glyphicon-tag[aria-hidden="true"]'), tag]
            )
          );
        }))
      ]),
      m('article', [
        m(`div`, m.trust(marked(data.body)))
      ]),
      m(
        'footer',
        m('div#back', m('a.btn.btn-default[href="/blog"]', {oncreate: m.route.link}, 'back'))
      )
    ]);
  }
}
