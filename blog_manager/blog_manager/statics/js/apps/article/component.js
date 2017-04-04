import m from 'mithril'
import MarkdownIt from 'markdown-it'
import model from './model.js';
import styles from './styles.css';

const md = new MarkdownIt();

const Cell = {
  view: vnode => {
    return <div className={`mdl-cell mdl-cell--${vnode.attrs.span}-col ${vnode.attrs.cls || ''}`}>
      {vnode.attrs.inner}
    </div>
  }
};

const Title = {
  view: vnode => {
    const model = vnode.attrs.model;
    const inner = <input type='text' className={styles.title}
      onchange={m.withAttr('value', v => model.data.title = v)}
      value={model.data.title}
    />
    return <Cell span={12} inner={inner} />
  }
};

const Tags = {
  view: vnode => {
    const model = vnode.attrs.model;
    const inner = <input type='text' className={styles.tags}
      onchange={m.withAttr('value', v => model.data.tags = v.split(','))}
      value={model.data.tags.join(',')}
    />
    return <Cell span={12} inner={inner} />
  }
};

const Editor = {
  view: vnode => {
    const inner = <div contentEditable={true} oninput={() => console.log('input')}>
      {vnode.attrs.model.data.body}
    </div>
    return <Cell span={6} cls={styles.editor} inner={inner} />
  }
};

const Preview = {
  view: vnode => {
    return <Cell span={6} cls={styles.preview} inner={
      m.trust(md.render(vnode.attrs.model.data.body))
    } />
  }
};

const Save = {
  view: vnode => {
    const model = vnode.model;
    const inner = <button
      className='mdl-button mdl-js-button mdl-button--raised mdl-button--colored'
      onclick={model.save}>
      save
    </button>
    return <Cell span={12} inner={inner} />
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
        <Editor model={model} />
        <Preview model={model} />
        <Save model={model} />
      </div>
    }
    return <div>データ取得中...</div>
  }
}
