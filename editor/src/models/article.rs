use diesel::prelude::*;
use models::establish_connection;

#[derive(Queryable, Serialize)]
pub struct Article {
    pub id: i32,
    pub title: String,
    pub slug: String,
    pub content: String,
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
            .select((id, title, slug, content, published, year, month, day))
            .order((year.desc(), month.desc(), day.desc()))
            .load(&conn)
            .expect("Error loading articles")
    }
}
