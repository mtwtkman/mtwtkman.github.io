import m from 'mithril'

import utils from '../../utils.js';


const Index = {
  data: [],
  fetch: function() {
    m.request({
      method: 'GET',
      url: '/articles/index.json',
      deserialize: JSON.parse
    })
    .then(function(response) {
      Index.data = response;
    });
  }
};

export default {
  oninit: function(vnode) {
    utils.setTitle('blog');
    Index.fetch();
  },
  head() {
    const meta = (property, content) => {
        document.querySelector(`meta[property="og:${property}"]`).content = content
    }
    meta('type', 'blog')
    meta('url', location.href)
    meta('title', 'blog')
  },
  view: function(vnode) {
    this.head()
    return m('div#article-list-wrapper', [
      m('div#article-list', Index.data.map(article => {
        const date = `${article.year}/${article.month}/${article.day}`;
        return m('div.title', [
          m('a',
            {
              href: `/blog/article/${date}/${article.slug}`,
              oncreate: m.route.link,
            },
            article.title
          ),
          m('span.post-date', `(${date})`)
        ]);
      })),
      m('div#footer-trans'),
      m('div#footer', [
        m(
          'a[href=/]',
          { oncreate: m.route.link },
          m('img[src="/assets/img/avatar.png"]')
        )
      ])
    ]);
  }
}
