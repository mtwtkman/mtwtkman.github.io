begin;

insert into entries (id, title, body, slug, published_at) values
  (1, 'a', 'xxx1', 'a', null),
  (2, 'b', 'xxx2', 'b', null),
  (3, 'c', 'xxx3', 'c', null),
  (4, 'd', 'xxx4', 'd', null)
;

insert into tags (id, name) values
  (1, 't1'),
  (2, 't2'),
  (3, 't3')
;

insert into tagged_entries (entry_id, tag_id) values
  (1, 1),
  (1, 2),
  (1, 3),
  (3, 2)
;

with targets (eid) as (
  select te.entry_id
  from tagged_entries te
    inner join tags t
      on t.id = te.tag_id
  where
    t.name = 't2'
)
select
  e.id
  ,group_concat(t.name)
from entries e
  inner join tagged_entries te
    on te.entry_id = e.id
  inner join tags t
    on t.id = te.tag_id
where
  e.id in (select eid from targets)
group by e.id
;
