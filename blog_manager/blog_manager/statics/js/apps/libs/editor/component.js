import m from 'mithril'
import Model from './model.js';
import styles from './styles.css';

const Cell = {
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

const Title = {
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

const Tags = {
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

const Editor = {
  oninit: vnode => {
    vnode.state.model = vnode.attrs.model;
  },
  view: vnode => {
    const model = vnode.state.model;
    const inner = <textarea
      className={styles.textarea}
      oninput={m.withAttr('value', v => {model.data.body = v})}>
        {m.trust(model.data.body)}
    </textarea>
    return <Cell span={6} cls={`${styles.editor} ${styles.editorLeftSide}`} inner={inner} />
  }
};

const Preview = {
  view: vnode => {
    return <Cell span={6} cls={`${styles.editor} ${styles.editorRightSide}`} inner={m.trust(vnode.attrs.body)} />
  }
};

const Save = {
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
    vnode.state.model = new Model(vnode.attrs.api);
    vnode.state.model.fetch();
  },
  view: vnode => {
    const model = vnode.state.model;
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
