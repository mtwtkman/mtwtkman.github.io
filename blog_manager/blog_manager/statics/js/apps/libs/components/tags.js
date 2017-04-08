import m from 'mithril';
import styles from './styles.css';
import Cell from './cell.js';

export default {
  oninit: vnode => {
    vnode.state.model = vnode.attrs.model;
    vnode.state.onchange = v => {
      vnode.state.model.data.tags = v.split(',');
    };
  },
  view: vnode => {
    const inner = <input type='text' className={styles.tags}
      onchange={m.withAttr('value', vnode.state.onchanage)}
      value={vnode.state.model.data.tags.join(',')}
    />
    return <Cell span={12} inner={inner} />
  }
};

