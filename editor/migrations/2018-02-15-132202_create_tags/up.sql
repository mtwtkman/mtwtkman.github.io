create table tags (
  id integer primary key autoincrement,
  name text not null unique
)
;

create table taggings (
  id integer primary key autoincrement,
  article_id int not null,
  tag_id int not null,
  foreign key(article_id) references articles(id),
  foreign key(tag_id) references tags(id),
  unique(article_id, tag_id)
)
;
