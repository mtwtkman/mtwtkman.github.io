import m from 'mithril'
import MarkdownIt from 'markdown-it'
import model from './model.js';
import styles from './styles.css';

const md = new MarkdownIt();

const Cell = {
  oninit: vnode => {
    vnode.state.span = vnode.attrs.span;
    vnode.state.cls = vnode.attrs.cls || '';
    vnode.state.inner = vnode.attrs.inner;
  },
  view: vnode => {
    return <div className={`mdl-cell mdl-cell--${vnode.state.span}-col ${vnode.state.cls}`}>
      {vnode.state.inner}
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
    const inner = <div contentEditable={true} oninput={ev => {
      model.data.body = ev.target.textContent.replace('<br>', '↵');
    }}>
      {m.trust(vnode.attrs.model.data.body.replace(/(↵|\r\n|\n|\r)/gm, '<br>'))}
    </div>
    return <Cell span={6} cls={`${styles.editor} ${styles.editorLeftSide}`} inner={inner} />
  }
};

const Preview = {
  oninit: vnode => {
    vnode.state.model = vnode.attrs.model;
  },
  view: vnode => {
    return <Cell span={6} cls={`${styles.editor} ${styles.editorRightSide}`} inner={m.trust(md.render(vnode.state.model.data.body))} />
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
    model.fetch();
  },
  view: vnode => {
    if (model.fetched) {
      return <div className='mdl-grid'>
        <Title model={model} />
        <Tags model={model} />
        <div className={styles.editorWrap}>
          <Editor model={model} />
          <Preview model={model} />
        </div>
        <Save model={model} />
      </div>
    }
    return <div>データ取得中...</div>
  }
}
