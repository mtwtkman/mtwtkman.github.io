import m from 'mithril';

export default function(method, url, data) {
  return m.request({ method, url, data, deserialize: JSON.parse});
}
