use diesel;
use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use chrono::prelude::*;


mod schema {
    table! {
        articles {
            id -> Nullable<Integer>,
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
use self::schema::articles::{dsl as articles_dsl};

#[table_name="articles"]
#[derive(Serialize, Queryable, Insertable, Debug, Clone)]
pub struct Article {
    pub id: Option<i32>,
    pub title: String,
    pub slug: String,
    pub content: String,
    pub published: bool,
    pub year: String,
    pub month: String,
    pub day: String,
}

#[derive(Serialize, Deserialize)]
pub struct ArticleData {
    pub title: String,
    pub slug: String,
    pub content: String,
    pub published: bool,
}

impl Article {
    pub fn select_all(conn: &SqliteConnection) -> Vec<Article> {
        articles_dsl::articles
            .order((articles::year.desc(), articles::month.desc(), articles::day.desc()))
            .load::<Article>(conn)
            .unwrap()
    }

    pub fn select(pk: i32, conn: &SqliteConnection) -> Article {
        articles_dsl::articles
            .find(pk)
            .get_result::<Article>(conn)
            .unwrap()
    }

    pub fn insert(data: ArticleData, conn: &SqliteConnection) -> Option<Article> {
        let now: DateTime<Local> = Local::now();
        let t = Article {
            id: None,
            title: data.title,
            slug: data.slug,
            content: data.content,
            published: data.published,
            year: format!("{:04}", now.year()),
            month: format!("{:02}", now.month()),
            day: format!("{:02}", now.day()),
        };
        let result = diesel::insert_into(articles::table)
            .values(&t)
            .execute(conn);
        match result.is_ok() {
            true => Some(t),
            false => None,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    fn setup() {
    }
    mod articles {
        #[test]
        fn insert() {
            assert!(true);
        }
    }
}
