import m from 'mithril'

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
  }
};

export default Model
