import m from 'mithril';
import Model from './model.js';

import styles from './styles.css';


const Ul = {
  view: vnode => {
    return <ul className='mdl-list'>
      {vnode.attrs.inner}
    </ul>
  }
};

const Li = {
  view: vnode => {
    return <li className='mdl-list__item'>
      {vnode.attrs.inner}
    </li>
  }
};

const Details = {
  view: vnode  => {
    return <details>
      <summary>{vnode.attrs.summary}</summary>
      {vnode.attrs.inner}
    </details>
  }
};

const Year = {
  view: vnode => {
    const data = vnode.attrs.data;
    const inner = data.months.map(d => {
      return <Ul inner={<Li inner={<Month data={d} />} />} />
    });
    return <div id={data.year}>
      <Details summary={`${data.year}年`} inner={inner} />
    </div>
  }
};

const Month = {
  view: vnode => {
    const data = vnode.attrs.data;
    const inner = data.days.map(d => {
      return <Ul inner={<Li inner={<Day data={d} />} />} />
    });
    return <div id={data.month}>
      <Details summary={`${data.month}月`} inner={inner} />
    </div>
  }
};

const Day = {
  view: vnode => {
    const data = vnode.attrs.data;
    const inner = <span>
      {`${data.day}日 `}
      <a href={`/article/${data.id}`}>
        {data.title}
      </a>
    </span>
    return <Li inner={inner} />
  }
};

export default {
  oninit: vnode => {
    Model.fetch();
    vnode.state.articleIndex = () => {
      return Model.data.map(d => {
        return <Ul inner={<Li inner={<Year data={d} />} />} />
      });
    };
  },
  view: vnode => {
    return <div className='mdl-grid'>
      <div className='mdl-cell--1-offset' />
      <div className='mdl-cell mdl-cell--10-col'>
        {(() => {
          if (!Model.fetched) {
            return <div className='mdl-spinner mdl-js-spinner is-active'></div>
          }
          return <Ul inner={vnode.state.articleIndex()} />
        })()}
      </div>
      <div className='mdl-cell--1-offset' />
    </div>
  }
}
