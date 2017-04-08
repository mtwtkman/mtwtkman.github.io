import m from 'mithril';
import Title from 'components/title';

describe('Title component', () => {
  describe('returns a component instance', () => {
    let model = {data: {title: ''}};
    let state = {};
    beforeEach(() => {
      state.model = model;
      state.onchange = null;
    });
    test('whose span is 12', () => {
      const component = Title.view({state});
      expect(component.attrs.span).toBe(12);
    });
    test('whose title is passed', () => {
      const title = 'hoge';
      state.model.data.title = title;
      const component = Title.view({state});
      expect(component.attrs.inner.attrs.value).toBe(title);
    });
    test('which is input tag', () => {
      const component = Title.view({state});
      expect(component.attrs.inner.tag).toBe('input');
    });
    test('work fine an onchange handler', () => {
      const title = 'title';
      const attrs = {model};
      const vnode = {attrs, state: {}};
      Title.oninit(vnode);
      vnode.state.onchange(title);
      expect(attrs.model.data.title).toBe(title);
    });
  });
});
