import m from 'mithril'

const Component = {
  view: vnode => {
    return m('div', 'hoge');
  }
};

m.route(document.body, '/', {
  '/': Component
});
