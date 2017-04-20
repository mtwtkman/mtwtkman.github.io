import m from 'mithril';
import styles from './styles.css';
import Cell from './cell.js';

export default {
  oninit: vnode => {
    vnode.state.model = vnode.attrs.model;
    vnode.state.onchange = v => {
      vnode.state.model.data.tags = v;
      console.log(vnode.state.model.data.tags);
    };
  },
  view: vnode => {
    const inner = <label>
      タグ
      <input type='text' className={styles.tags}
        onchange={m.withAttr('value', vnode.state.onchange)}
        value={vnode.state.model.data.tags}
      />
    </label>
    return <Cell span={12} inner={inner} />
  }
};

