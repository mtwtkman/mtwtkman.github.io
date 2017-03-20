import m from 'mithril'

import utils from '../../utils.js'


const Tags = {
  data: [],
  fetch: function() {
    m.request({
      method: 'GET',
      url: '/articles/tagging.json',
      deserialize: JSON.parse
    })
    .then(function(response) {
      console.log(response);
      Tags.data = Object.keys(response);
    });
  }
}

export default {
  oninit: function() {
    utils.setTitle('tags');
    Tags.fetch();
  },
  view: function() {
    return m('ul', Tags.data.map(tag => {
      return m('li',
        m('a', {
          href: `/blog/tag/${tag}`,
          oncreate: m.route.link,
        },
        tag)
      );
    }));
  }
}
