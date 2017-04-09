import m from 'mithril';
import styles from './styles.css';
import Cell from 'libs/components/cell';
import Title from 'libs/components/title';
import Tags from 'libs/components/tags';
import Editor from 'libs/components/editor';
import Preview from 'libs/components/preview';
import Save from 'libs/components/save';
import Model from 'libs/models/article';

const model = new Model();

export default {
  view: vnode => {
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
}
