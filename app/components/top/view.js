import m from 'mithril';


function view(ctrl) {
  return m('div#top-header', [
    m('img#top-img[src="../../../assets/img/avatar.png"]'),
    m('div#social-links', [
      m('a[href="https://github.com/mtwtkman"]', m('i.fa.fa-github-alt.my-i-size')),
      m('a[href="https://twitter.com/mtwtkman"]', m('i.fa.fa-twitter.my-i-size')),
    ])
  ]);
}

export default view;
