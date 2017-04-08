import Cell  from 'components/cell'

function createComponent(state, attrs) {
  return Cell.view({state, attrs});
}

describe('Cell component', () => {
  describe('returns a component instance', () => {
    let state, attrs;
    beforeEach(() => {
      state = {span: '', cls: ''};
      attrs = {inner: null};
    });
    test('whose tag is div', () => {
      const component = createComponent(state, attrs);
      expect(component.tag).toBe('div');
    });
    test('which includes a child', () => {
      const component = createComponent(state, attrs);
      expect(component.children.length).toBe(1);
      expect(component.children[0]).toBeNull;
    });
    test('which is modified by mdl without a span and a cls', () => {
      const component = createComponent(state, attrs);
      expect(component.attrs.className).toBe('mdl-cell mdl-cell---col ');
    });
    test('with a span', () => {
      state.span = 1;
      const component = createComponent(state, attrs);
      expect(component.attrs.className).toBe('mdl-cell mdl-cell--1-col ');
    });
    test('with a cls', () => {
      state.cls = 'hoge'
      const component = createComponent(state, attrs);
      expect(component.attrs.className).toBe('mdl-cell mdl-cell---col hoge');
    });
  });
});
