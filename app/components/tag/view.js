import m from 'mithril';


function view(ctrl) {
  let props = ctrl.props;
  return m('div', [
    m('div#tag-header', m('h2', `tag: ${props.tag}`)),
    m('div#tag-list', props.data.map(prop => {
      return m('div', [
        m(`a[href='/article/${prop.path}']`, {config: m.route}, prop.title)
      ])
    }))
  ]);
}

export default view;
