import m from 'mithril';
import styles from './styles.css';
import Cell from './cell.js';

export default {
  oninit: vnode => {
    vnode.state.model = vnode.attrs.model;
    vnode.state.oninput = v => {
      vnode.state.model.data.body = v;
    };
  },
  view: vnode => {
    const inner = <textarea
      className={styles.textarea}
      oninput={m.withAttr('value', vnode.state.oninput)}>
        {vnode.state.model.data.body}
    </textarea>
    return <Cell span={6} cls={`${styles.editor} ${styles.editorLeftSide}`} inner={inner} />
  }
};
