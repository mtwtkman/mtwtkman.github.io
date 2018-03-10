use diesel::prelude::*;
use super::{Article, Tag};

mod schema {
    table! {
        taggings (article_id, tag_name) {
            article_id -> Integer,
            tag_name -> Text,
        }
    }
}

use self::schema::taggings;
use self::schema::taggings::dsl;

#[derive(Identifiable, Serialize, Queryable, Associations)]
#[belongs_to(Article, foreign_key = "article_id")]
#[belongs_to(Tag, foreign_key = "tag_name")]
#[table_name = "taggings"]
#[primary_key(article_id, tag_name)]
pub struct Tagging {
    pub article_id: i32,
    pub tag_name: String,
}

impl Tagging {
    pub fn tags_by_article(article_id: i32, conn: &SqliteConnection) -> Vec<Tag> {
        dsl::taggings
            .filter(taggings::article_id.eq(article_id))
            .select(taggings::tag_name)
            .load::<String>(conn)
            .unwrap()
            .iter()
            .map(|t| Tag {name: t.to_string()})
            .collect()
    }
}
