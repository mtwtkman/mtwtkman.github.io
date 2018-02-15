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
