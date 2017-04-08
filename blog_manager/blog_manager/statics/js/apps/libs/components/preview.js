import m from 'mithril';
import styles from './styles.css';
import Cell from './cell.js';

export default {
  view: vnode => {
    return <Cell span={6} cls={`${styles.editor} ${styles.editorRightSide}`}
                 inner={m.trust(vnode.attrs.body)} />
  }
}
