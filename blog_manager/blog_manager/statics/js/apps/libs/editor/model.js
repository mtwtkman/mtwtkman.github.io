import m from 'mithril'
import { Request } from './request.js'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt();

export default class Model {
  constructor(url) {
    this.data = {},
    this.fetched = false,
    this.request = new Request(url);
  }
  fetch() {
    return this.request
      .get()
      .then(response => {
        this.fetched = true;
        this.data = response;
      });
  }
  save() {
    return this.request
      .post(this.data)
      .then(response => {
        this.data = response;
      });
  }
  mdBody() {
    return md.render(this.data.body);
  }
};

export default Model
