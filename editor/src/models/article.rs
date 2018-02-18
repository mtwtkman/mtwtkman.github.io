use diesel;
use diesel::prelude::*;
use chrono::prelude::*;

mod schema {
    table! {
        articles {
            id -> Integer,
            title -> Text,
            slug -> Text,
            content -> Text,
            published -> Bool,
            created_at -> Timestamp,
        }
    }
}

use self::schema::articles;
use self::schema::articles::{dsl as articles_dsl};

#[derive(Serialize, Queryable)]
#[table_name = "articles"]
pub struct Article {
    pub id: i32,
    pub title: String,
    pub slug: String,
    pub content: String,
    pub published: bool,
    pub created_at: NaiveDateTime,
}

#[derive(Clone, Deserialize, Insertable)]
#[table_name = "articles"]
pub struct NewArticle {
    pub title: String,
    pub slug: String,
    pub content: String,
    pub published: bool,
}

impl Article {
    pub fn select_all(conn: &SqliteConnection) -> Vec<Article> {
        articles_dsl::articles
            .order(articles::created_at.desc())
            .load::<Article>(conn)
            .unwrap()
    }

    pub fn select(pk: i32, conn: &SqliteConnection) -> Article {
        articles_dsl::articles
            .find(pk)
            .get_result::<Article>(conn)
            .unwrap()
    }

    pub fn insert(data: NewArticle, conn: &SqliteConnection) -> usize {
        diesel::insert_into(articles::table)
            .values(&data)
            .execute(conn)
            .unwrap()
    }

    pub fn update(data: Article, conn: &SqliteConnection) -> usize {
        diesel::update(articles_dsl::articles.filter(articles::id.eq(&data.id)))
            .set((
                articles::title.eq(&data.title),
                articles::slug.eq(&data.slug),
                articles::content.eq(&data.slug),
                articles::published.eq(&data.published)
            ))
            .execute(conn)
            .unwrap()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use db::init_pool;
    use r2d2::PooledConnection;
    use r2d2_diesel::ConnectionManager;

    fn connection() -> PooledConnection<ConnectionManager<SqliteConnection>> {
        let pool = init_pool();
        pool.get().unwrap()
    }
    fn clear_tables(conn: &SqliteConnection) {
        diesel::delete(articles::table).execute(conn);
    }
    #[test]
    fn insert_first_article_test() {
        let conn = connection();
        let data = NewArticle {
            title: "test".to_string(),
            slug: "a-h-o".to_string(),
            content: "uoooo".to_string(),
            published: true,
        };
        Article::insert(data, &conn);
        let subject: Article = articles_dsl::articles
            .order(articles::id.desc())
            .first::<Article>(&*conn)
            .unwrap();
        assert_eq!(subject.title, data.title);
        assert_eq!(subject.slug, data.slug);
        assert_eq!(subject.content, data.content);
        assert_eq!(subject.published, data.published);
        clear_tables(&conn);
    }
}
