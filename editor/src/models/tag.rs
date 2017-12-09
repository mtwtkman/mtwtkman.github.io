use diesel::prelude::*;
use models::establish_connection;
use models::schema::tags;
use models::Article;

#[derive(Identifiable, Queryable, Serialize)]
pub struct Tag {
    pub id: i32,
    pub name: String,
}

impl Tag {
    pub fn select_related_with(article: &Article) -> Vec<Tag> {
        use models::schema::articles::dsl::*;
        use models::schema::tags::dsl::*;
        use models::schema::taggings::dsl::*;
        let conn = establish_connection();
        tags
            .inner_join(taggings.inner_join(articles))
            .select((tags::id, tags::name))
            .load(&conn)
            .expect("Error loading articles")
    }
}
