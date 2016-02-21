import Tagging from 'json!yaml!../../../tagging.yml';


function model(name) {
  return {
    tag: name,
    data: Tagging[name]
  };
}

export default model;
