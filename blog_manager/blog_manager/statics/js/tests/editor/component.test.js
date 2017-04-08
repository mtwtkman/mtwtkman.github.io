import m from 'mithril'
import { Cell }  from '../../apps/article/component.js'

describe('Cell component', () => {
  test('returns a component which was modified mdl', () => {
    const state = {span: 1, cls: ''};
    const attrs = {inner: null};
    const component = Cell.view({ state, attrs });
    expect(component.tag).toBe('div');
    expect(component.children.length).toBe(1);
    expect(component.attrs.className).toBe('mdl-cell mdl-cell--1-col ');
  });
});
