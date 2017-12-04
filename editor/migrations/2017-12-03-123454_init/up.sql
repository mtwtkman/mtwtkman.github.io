create table articles (
  id integer primary key not null,
  title text not null,
  slug text not null,
  content text not null,
  published boolean not null default false,
  year varchar(4) not null,
  day varchar(2) not null,
  month varchar(2) not null
)
;

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

