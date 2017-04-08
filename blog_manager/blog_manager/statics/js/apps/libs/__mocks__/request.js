export default (method, url, data) => {
  return new global.Promise((resolve, reject) => {
    return resolve(data || {body: 'test'});
  });
}
