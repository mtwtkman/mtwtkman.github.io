create table articles (
  id integer primary key autoincrement,
  title text not null unique,
  slug text not null unique,
  body text not null unique,
  published boolean not null default false,
  created_at datetime not null default CURRENT_TIMESTAMP
)
;
