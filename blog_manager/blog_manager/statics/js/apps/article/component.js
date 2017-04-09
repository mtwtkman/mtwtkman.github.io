import m from 'mithril';
import styles from './styles.css';
import Cell from 'libs/components/cell';
import Title from 'libs/components/title';
import Tags from 'libs/components/tags';
import Slug from 'libs/components/slug';
import Editor from 'libs/components/editor';
import Preview from 'libs/components/preview';
import Save from 'libs/components/save';
import Model from 'libs/models/article';

const model = new Model();

export default {
  oninit: vnode => {
    model.fetch();
  },
  view: vnode => {
    if (model.fetched) {
      return <div className='mdl-grid'>
        <Title model={model} />
        <Slug model={model} />
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
