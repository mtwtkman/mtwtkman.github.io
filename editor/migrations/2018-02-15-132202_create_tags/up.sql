create table tags (
  name text primary key not null unique
)
;

create table taggings (
  article_id int not null,
  tag_name text not null,
  foreign key(article_id) references articles(id),
  foreign key(tag_name) references tags(name) on update cascade on delete cascade,
  unique(article_id, tag_name)
)
;
