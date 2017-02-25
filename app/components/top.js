import m from 'mithril';

export default {
  view: function() {
    return m('div#top-header', [
      m('figure#img-wrapper', [
        m('a[href=/blog]',
          {oncreate: m.route.link},
          m('img#top-img[src="assets/img/avatar.png"]')
        )
      ]),
      m('div#social-links', [
        m('a[href="https://github.com/mtwtkman"]', m('i.fa.fa-github-alt.my-i-size')),
        m('a[href="https://twitter.com/mtwtkman"]', m('i.fa.fa-twitter.my-i-size')),
        m('a[href="rss.xml"]', m('i.fa.fa-rss.my-i-size'))
      ])
    ]);
  }
}
