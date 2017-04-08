import Editor from 'libs/components/editor';

describe('Editor component', () => {
  describe('returns an instance', () => {
    let model, state;
    beforeEach(() => {
       model = {data: {body: ''}};
       state = {model, oninput: null};
    });
    test('which is textarea tag', () => {
      const component = Editor.view({state});
      expect(component.attrs.inner.tag).toBe('textarea');
    });
    test('whose span is 6', () => {
      const component = Editor.view({state});
      expect(component.attrs.span).toBe(6);
    });
    test('whose an oninput handler works fine', () => {
      const vnode = {attrs: {model}, state};
      Editor.oninit(vnode);
      const body = 'hoge'
      vnode.state.oninput(body);
      expect(model.data.body).toBe(body);
    });
  });
});
