import m from 'mithril';
import Cell from './cell.js';
import styles from './styles.css';

export default {
  oninit: vnode => {
    vnode.state.model = vnode.attrs.model;
    vnode.state.onchange = v => {
      vnode.state.model.data.slug = v;
    };
  },
  view: vnode => {
    const inner = <label>
      URL
      <input type='text' className={styles.slug}
        onchange={m.withAttr('value', vnode.state.onchange)}
        value={vnode.state.model.data.slug}
      />
    </label>
    return <Cell span={12} inner={inner} />
  }
};
