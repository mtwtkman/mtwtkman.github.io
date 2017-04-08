import m from 'mithril';
import Preview from 'components/preview';

describe('Preview component', () => {
  describe('returns a component instance', () => {
    const attrs = {};
    beforeEach(() => {
      attrs.body = '';
    });
    test('whose span is 6', () => {
      const component = Preview.view({attrs});
      expect(component.attrs.span).toBe(6);
    });
    test('whose body is trusted html string', () => {
      const body = '<div>hoge</div>';
      attrs.body = body;
      const component = Preview.view({attrs})
      expect(component.attrs.inner.text).toBe(m.trust(body).text);
    });
  });
});
