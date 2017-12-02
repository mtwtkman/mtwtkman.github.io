create table articles (
  id integer primary key,
  title text not null,
  slug text not null,
  published boolean not null default false,
  year string not null,
  day string not null,
  month string not null
)
;

create table tags (
  id integer primary key,
  name text not null
)
;

create table taggings (
  article_id int not null,
  tag_id int not null,
  foreign key(article_id) references articles(id),
  foreign key(tag_id) references tags(id)
)
;
