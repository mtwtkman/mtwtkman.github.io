export class Request {
  constructor(url) {
    this.url = url;
  }
  _req(method, data=null) {
    const conf = {
      method,
      this.url: url
    };
    if (data) {
      conf.data = data;
    }
    return m.request(conf);
  }
  get(data=null) {
    return this._req('GET', data);
  }
  post(data=null) {
    return this._req('POST', data);
  }
  put(data=null) {
    return this._req('PUT', data);
  }
  delete(data=null) {
    return this._req('DELETE', data);
  }
}
