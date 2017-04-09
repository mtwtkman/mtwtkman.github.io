import m from 'mithril';
import Cell from './cell.js';
import styles from './styles.css';

export default {
  oninit: vnode => {
    vnode.state.model = vnode.attrs.model;
    vnode.state.onchange = v => {
      vnode.state.model.data.title = v;
    };
  },
  view: vnode => {
    const inner = <label>
      タイトル
      <input type='text' className={styles.title}
        onchange={m.withAttr('value', vnode.state.onchange)}
        value={vnode.state.model.data.title}
      />
    </label>
    return <Cell span={12} inner={inner} />
  }
};
