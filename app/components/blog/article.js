import m from 'mithril'
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
      url: `/articles/${args.year}/${args.month}/${args.day}/${args.title}.json`,
      deserialize: JSON.parse
    })
    .then(function(response) {
      Article.data.title = response.title;
      Article.data.tags = response.tags;
      Article.data.date = response.date;
      Article.data.body = response.body;
      utils.setTitle(response.title);
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
    Article.fetch(attrs);
  },
  onupdate: function(vnode) {
    Array.from(document.getElementsByTagName('pre')).forEach(x => {
      hljs.highlightBlock(x);
    });
  },
  head(data) {
    const meta = (property, content) => {
      document.querySelector(`meta[property="og:${property}"`).content = content
    }
    meta('type', 'website')
    meta('url', location.href)
    meta('title', data.title)
  },
  view: function(vnode) {
    const data = Article.data;
    this.head(data)
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
            m('a',
              {
                href: `/blog/tag/${tag}`,
                oncreate: m.route.link
              },
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
