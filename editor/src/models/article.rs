use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;


mod schema {
    table! {
        articles {
            id -> Integer,
            title -> Text,
            slug -> Text,
            content -> Text,
            published -> Bool,
            year -> Text,
            month -> Text,
            day -> Text,
        }
    }
}


use self::schema::articles;
use self::schema::articles::dsl::*;

#[table_name="articles"]
#[derive(Serialize, Queryable)]
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
    pub fn select_all(conn: &SqliteConnection) -> Vec<Article> {
        articles
            .order((articles::year.desc(), articles::month.desc(), articles::day.desc()))
            .load::<Article>(conn)
            .unwrap()
    }
}
