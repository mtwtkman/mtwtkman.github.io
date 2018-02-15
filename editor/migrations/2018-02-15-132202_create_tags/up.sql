create table tags (
  id integer primary key not null,
  name text not null
)
;

create table taggings (
  id integer primary key not null,
  article_id int not null,
  tag_id int not null,
  foreign key(article_id) references articles(id),
  foreign key(tag_id) references tags(id)
)
;
