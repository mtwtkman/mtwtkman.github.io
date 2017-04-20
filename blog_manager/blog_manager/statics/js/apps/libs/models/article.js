import request from '../request.js';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

export default class Model {
  constructor(data) {
    this.data = data || {
      title: '',
      body: '',
      slug: '',
      published: false,
      tags: '',
      date: null,
    };
    this.fetched = false;
    this.resourcesUrl = '/api/articles';
    this.resourceUrl = `${this.resourcesUrl}/${location.pathname.split('/')[2]}`;
  }
  fetch() {
    return request('GET', this.resourceUrl)
      .then(response => {
        this.fetched = true;
        this.data = response;
    });
  }
  create() {
    return request('POST', this.resourcesUrl, this.data)
      .then(response => {
        this.data = response;
    });
  }
  update() {
    return request('PUT', this.resourceUrl, this.data)
      .then(response => {
        this.data = response;
    });
  }
  delete() {
    return request('DELETE', this.resourceUrl)
      .then(response => {
        this.data = null;
      });
  }
  mdBody() {
    return md.render(this.data.body);
  }
  setTag() {
    return v => this.data.tag = v;
  }
}
