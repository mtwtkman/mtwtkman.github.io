import m from 'mithril';
import Cell from './cell.js';

export default {
  oninit: vnode => {
    vnode.state.model = vnode.attrs.model;
  },
  oncreate: vnode => {
    componentHandler.upgradeElement(vnode.dom.children[0]);
  },
  view: vnode => {
    const model = vnode.state.model;
    const inner = <label for='published' className='mdl-switch mdl-js-switch mdl-js-ripple-effect'>
      <input
        type='checkbox'
        id='published'
        className='mdl-switch__input'
        checked={model.data.published}
        onclick={m.withAttr('checked', v => {
          model.data.published = v;
        })}
      />
      <span className='mdl-switch__label'>公開</span>
    </label>
    return <Cell span={12} inner={inner} />
  }
}
