create table tags (
  name text primary key not null unique
)
;

create table taggings (
  id integer primary key autoincrement,
  article_id int not null,
  tag_name text not null,
  foreign key(article_id) references articles(id),
  foreign key(tag_name) references tags(name),
  unique(article_id, tag_name)
)
;
