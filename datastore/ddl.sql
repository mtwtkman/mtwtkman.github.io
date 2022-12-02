create table entries (
  title text not null
  ,body text not null
  ,slug text primary key
  ,created_at datetime not null
)
;

create table published_entries (
  entry_slug text primary key
  ,published_at datetime not null
  ,foreign key (entry_slug) references entries (slug) on delete cascade
);

create table tags (
  name text unique not null
)
;

create table tagged_entries (
  entry_slug text not null
  ,tag_name text not null
  ,foreign key (entry_slug) references entries (slug) on delete cascade
  ,foreign key (tag_name) references tags (name) on delete cascade
  ,unique(entry_slug, tag_name)
)
;
