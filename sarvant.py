from contextlib import contextmanager
import sqlite3
from pathlib import Path

import yaml


ENTRIES_DIR = Path("./entries")
ENTRY_DRAFT_DIR = ENTRIES_DIR / "draft"
ENTRY_PUBLISHED_DIR = ENTRIES_DIR / "published"

def create_draft(slug):
    data = f"""
    title:
    slug: {slug}
    body: -|
    """.dedent()
    destpath = ENTRY_DRAFT_DIR / f"{slug}.yaml"
    with open(destpath, "wb") as fp:
        fp.write(data)
    return destpath


@contextmanger
def dbsession(db):
    with sqlite3.connect(db) as con:
        yield con.cur


class PublishedEntry:
    def __init__(self, id, title, body, slug, tags, published_at):
        self.id = id
        self.title = title
        self.body = body
        self.slug = slug
        self.tags = tags
        self.published_at

def map_published_entries(rows):
    return (PublishedEntry(*row) for row in resultset)

def fetch_published_entries(db):
    with dbsession(db) as cur:
        resultset = cur.execute("""
        select
          e.id
          ,e.title
          ,e.body
          ,e.slug
          ,group_concat(t.name) as tags
          ,e.published_at
        from entries e
          left join tagged_entries te
            on te.entry_id = e.id
          left join tags t
            on t.id = te.tag_id
        where e.published_at is not null
        group by e.id
        ;
        """).fetchall()
    return (PublishedEntry(*row) for row in resultset)


def fetch_tagged_entries(db, tag_name):
    with dbsession(db) as cur:
        result = cur execute("""
        select
          e.id
          ,e.title
          ,e.body
          ,e.slug
          ,group_concat(t.name) as tags
          ,e.published_at
        from entries e
          inner join tagged_entries te
            on te.entry_id = e.id
          inner join tags t
            on t.id = te.tag_id
        where e.id in (
          select te.entry_id
          from tagged_entries te
            inner join tags t
              on t.id = te.tag_id
          where t.name = ?
        )
        ;
        """).fetchall()


def run():
    print("hoge")
