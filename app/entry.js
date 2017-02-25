import m from 'mithril'
import Top from './components/top.js'
import BlogIndex from './components/blog/index.js'
import Article from './components/blog/article.js'
import Tag from './components/blog/tag.js'
import TagIndex from './components/blog/tags.js'

m.route(document.getElementById('main'), '/', {
  '/': Top,
  '/blog': BlogIndex,
  '/blog/article/:year/:month/:day/:title': Article,
  '/blog/tag': TagIndex,
  '/blog/tag/:name': Tag
});
