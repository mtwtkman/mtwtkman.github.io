import m from 'mithril'

export default {
  oninit: vnode => {
    vnode.state.span = vnode.attrs.span;
    vnode.state.cls = vnode.attrs.cls;
  },
  view: vnode => {
    return <div className={`mdl-cell mdl-cell--${vnode.state.span}-col ${vnode.state.cls}`}>
      {vnode.attrs.inner}
    </div>
  }
}
