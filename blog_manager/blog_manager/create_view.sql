drop view if exists article_index;
create view article_index as
select
  title,
  slug,
  strftime('%Y', created_at) as year,
  strftime('%m', created_at) as month,
  strftime('%d', created_at) as day
from articles
where published = 1
order by created_at desc
;

drop view if exists tagging;
create view tagging as
select
  x.name,
  y.title,
  strftime('%Y/%m/%d/', y.created_at) || y.slug
from tags x
  inner join articles_tags at
    on at.tag_id == x.id
  inner join articles y
    on y.id = at.article_id
order by
  x.id,
  y.created_at desc
;
