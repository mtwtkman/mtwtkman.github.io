use diesel::prelude::*;
use models::establish_connection;
use models::schema::tags;
use models::Article;

#[derive(Identifiable, Queryable, Serialize, Debug)]
pub struct Tag {
    pub id: i32,
    pub name: String,
}

impl Tag {
    pub fn select_related_with(article: &Article) -> Vec<Tag> {
        use models::schema::articles::dsl::{articles, id as article_id};
        use models::schema::taggings::dsl::taggings;
        use models::schema::tags::dsl::*;
        let conn = establish_connection();
        tags
            .inner_join(taggings.inner_join(articles))
            .filter(article_id.eq(article.id))
            .select((id, name))
            .load(&conn)
            .expect("Error loading articles")
    }
}
