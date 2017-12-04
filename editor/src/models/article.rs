use diesel::prelude::*;
use models::establish_connection;

#[derive(Queryable)]
pub struct Article {
    pub id: i32,
    pub title: String,
    pub slug: String,
    pub published: bool,
    pub year: String,
    pub day: String,
    pub month: String,
}

impl Article {
    pub fn select_all() -> Vec<Article> {
        use models::schema::articles::dsl::*;
        let conn = establish_connection();
        articles
            .select((id, title, slug, published, year, day, month))
            .load(&conn)
            .expect("Error loading articles")
    }
}
