import m from 'mithril';


function view(ctrl) {
  let props = ctrl.props;
  return m('div#article-list-wrapper', [
    m('div#article-list', props.map(prop => {
      return m('div.title', [
        m(`a[href='/blog/article/${prop.href}']`,
          {config: m.route},
          prop.title
        ),
        m('span.post-date', `(${prop.date})`)
      ]);
    })),
    m('div#footer-trans'),
    m('div#footer', [
      m('a[href="/"]', {config: m.route}, m('img[src="../../../../assets/img/avatar.png"]'))
    ])
  ]);
}

export default view;
