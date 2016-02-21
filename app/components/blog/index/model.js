import utils from 'utils';


function model() {
  let data = utils.parseYaml();
  return data.map(d => {
    return {
      title: d.title,
      date: d.date,
      href: `${d.date.split(' ')[0]}/${d.slug}`
    };
  });
}

export default model;
