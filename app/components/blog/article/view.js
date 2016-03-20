import m from 'mithril';
import marked from 'marked';

marked.setOptions({
  gfm: true
});


function view(ctrl) {
  let data = ctrl.data;
  return m('section', [
    m('header', [
      m('h1', data.title),
      m('div#description', data.description),
      m('div#article-date', [
        m('span.glyphicon.glyphicon-time[aria-hidden="true"]'),
        data.date
      ]),
      m('div#tags', data.tags.map(tag => {
        return m('span.tag', m(`a[href='/blog/tag/${tag}']`, {config: m.route}, [
          m('span.glyphicon.glyphicon-tag[aria-hidden="true"]'),
          tag
        ]));
      }))
    ]),
    m('article', [
      m(`div#utime='${data.utime}'`, m.trust(marked(data.body)))
    ]),
    m('footer', [
      m('div#back', [
        m('a.btn.btn-default[href="/blog/"]', {config: m.route}, 'back')
      ])
    ])
  ]);
}

export default view;
