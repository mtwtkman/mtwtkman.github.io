import Tags from 'components/tags';

describe('Tags component', () => {
  describe('returns a component instance', () => {
    let model = {data: {tags: []}};
    let state = {};
    beforeEach(() => {
      state.model = model;
      state.onchange = null;
    });
    test('which is input tag', () => {
      const component = Tags.view({state});
      expect(component.attrs.inner.tag).toBe('input');
    });
    test('whose value is joined by commas', () => {
      const tags = ['hoge', 'fuga'];
      model.data.tags = tags;
      const component = Tags.view({state});
      expect(component.attrs.inner.attrs.value).toBe(tags.join(','));
    });
    test('whose an onchange handler works fine', () => {
      const tags = ['pi', 'yo']
      const attrs = {model};
      const vnode = {attrs, state: {}};
      Tags.oninit(vnode);
      vnode.state.onchange(tags.join(','));
      expect(model.data.tags).toEqual(tags);
    });
  });
});
