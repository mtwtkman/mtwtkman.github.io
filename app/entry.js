import m from 'mithril';
import Index from './components/index/component';
import Article from './components/article/component';
import Tag from './components/tag/component';


m.route.mode = 'hash';
m.route(document.getElementById('main'), '/', {
  '/': Index,
  '/article/:date.../:slug': Article,
  '/tag/:name': Tag
});
