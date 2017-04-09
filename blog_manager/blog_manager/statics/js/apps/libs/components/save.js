import m from 'mithril';
import styles from './styles.css';
import Cell from './cell.js';

export default {
  oninit: vnode => {
    vnode.state.model = vnode.attrs.model;
    vnode.state.onclick = vnode.attrs.onclick;
  },
  view: vnode => {
    const inner = <button
      className='mdl-button mdl-js-button mdl-button--raised mdl-button--colored'
      onclick={vnode.state.onclick}>
      save
    </button>
    return <Cell span={12} cls={styles.saveButton} inner={inner} />
  }
};

