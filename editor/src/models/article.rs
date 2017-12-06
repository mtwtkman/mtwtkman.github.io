use diesel::prelude::*;
use models::establish_connection;
use models::schema::articles;

#[derive(Identifiable, Queryable, Serialize)]
pub struct Article {
    pub id: i32,
    pub title: String,
    pub slug: String,
    pub content: String,
    pub published: bool,
    pub year: String,
    pub month: String,
    pub day: String,
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

    pub fn select(pk: i32) -> Article {
        use models::schema::articles::dsl::*;
        let conn = establish_connection();
        articles
            .select((id, title, slug, content, published, year, month, day))
            .find(pk)
            .first(&conn)
            .expect("Error loading articles")
    }
}
