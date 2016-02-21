import m from 'mithril';
import Top from './components/top/component';
import Blog from './components/blog/index/component';
import Article from './components/blog/article/component';
import Tag from './components/blog/tag/component';


m.route.mode = 'hash';
m.route(document.getElementById('main'), '/', {
  '/': Top,
  '/blog': Blog,
  '/blog/article/:date.../:slug': Article,
  '/blog/tag/:name': Tag
});
