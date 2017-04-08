import m from 'mithril'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt();
const url =  `/api/articles/${location.href.split('/').slice(4).join('/')}`;

const Model = {
  data: {},
  fetched: false,
  fetch: () => {
    return m.request({
      method: 'GET',
      url: url,
    }).then(response => {
      Model.fetched = true;
      Model.data = response;
    });
  },
  save: () => {
    return m.request({
      method: 'POST',
      url: url,
    }).then(response => {
      Model.data = response;
    });
  },
  mdBody: () => {
    return md.render(Model.data.body);
  }
};

export default Model
