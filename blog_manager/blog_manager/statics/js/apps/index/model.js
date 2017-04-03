import m from 'mithril';

const Model = {
  data: [],
  fetched: false,
  fetch: () => {
    return m.request({
      method: 'GET',
      url: '/api/articles',
    }).then(response => {
      Model.fetched = true;
      Model.data = response;
    });
  }
};

export default Model