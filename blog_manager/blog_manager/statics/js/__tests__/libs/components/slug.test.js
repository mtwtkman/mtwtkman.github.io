import Slug from 'libs/components/slug';

describe('Slug component', () => {
  describe('returns a component instance', () => {
    let model = {data: {slug: ''}};
    let state = {};
    beforeEach(() => {
      state.model = model;
      state.onchange = null;
    });
    test('whose span is 12', () => {
      const component = Slug.view({state});
      expect(component.attrs.span).toBe(12);
    });
    test('which includes a label', () => {
      const component = Slug.view({state});
      expect(component.attrs.inner.tag).toBe('label');
      expect(component.attrs.inner.children[0].children).toBe('URL');
    });
    test('whose slug is passed', () => {
      const slug = 'ho-ge';
      state.model.data.slug = slug;
      const component = Slug.view({state});
      expect(component.attrs.inner.children[1].attrs.value).toBe(slug);
    });
    test('which is input tag', () => {
      const component = Slug.view({state});
      expect(component.attrs.inner.children[1].tag).toBe('input');
    });
    test('work fine an onchange handler', () => {
      const slug = 'sl-ug';
      const attrs = {model};
      const vnode = {attrs, state: {}};
      Slug.oninit(vnode);
      vnode.state.onchange(slug);
      expect(attrs.model.data.slug).toBe(slug);
    });
  });
});

