import m from 'mithril'
import model from './model.js';
import styles from './styles.css';

export const Cell = {
  oninit: vnode => {
    vnode.state.span = vnode.attrs.span;
    vnode.state.cls = vnode.attrs.cls || '';
  },
  view: vnode => {
    return <div className={`mdl-cell mdl-cell--${vnode.state.span}-col ${vnode.state.cls}`}>
      {vnode.attrs.inner}
    </div>
  }
};

export const Title = {
  oninit: vnode => {
    vnode.state.model = vnode.attrs.model;
  },
  view: vnode => {
    const model = vnode.state.model;
    const inner = <input type='text' className={styles.title}
      onchange={m.withAttr('value', v => model.data.title = v)}
      value={model.data.title}
    />
    return <Cell span={12} inner={inner} />
  }
};

export const Tags = {
  oninit: vnode => {
    vnode.state.model = vnode.attrs.model;
  },
  view: vnode => {
    const model = vnode.state.model;
    const inner = <input type='text' className={styles.tags}
      onchange={m.withAttr('value', v => model.data.tags = v.split(','))}
      value={model.data.tags.join(',')}
    />
    return <Cell span={12} inner={inner} />
  }
};

export const Editor = {
  oninit: vnode => {
    vnode.state.model = vnode.attrs.model;
  },
  view: vnode => {
    const model = vnode.state.model;
    const inner = <textarea
      className={styles.textarea}
      oninput={m.withAttr('value', v => {model.data.body = v})}>
        {model.data.body}
    </textarea>
    return <Cell span={6} cls={`${styles.editor} ${styles.editorLeftSide}`} inner={inner} />
  }
};

export const Preview = {
  view: vnode => {
    return <Cell span={6} cls={`${styles.editor} ${styles.editorRightSide}`} inner={m.trust(vnode.attrs.body)} />
  }
};

export const Save = {
  oninit: vnode => {
    vnode.state.model = vnode.attrs.model;
  },
  view: vnode => {
    const model = vnode.state.model;
    const inner = <button
      className='mdl-button mdl-js-button mdl-button--raised mdl-button--colored'
      onclick={model.save}>
      save
    </button>
    return <Cell span={12} cls={styles.saveButton} inner={inner} />
  }
};

export default {
  oninit: vnode => {
    model.fetch();
  },
  view: vnode => {
    if (model.fetched) {
      return <div className='mdl-grid'>
        <Title model={model} />
        <Tags model={model} />
        <div className={styles.editorWrap}>
          <Editor key='editor' model={model} />
          <Preview key='preview' body={model.mdBody()} />
        </div>
        <Save model={model} />
      </div>
    }
    return <div>データ取得中...</div>
  }
}
