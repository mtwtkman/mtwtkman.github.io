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

#[derive(Debug, PartialEq, Clone, Serialize, Queryable)]
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
                articles::content.eq(&data.content),
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

    struct Conn {
    }

    fn connection() -> PooledConnection<ConnectionManager<SqliteConnection>> {
        let pool = init_pool();
        pool.get().unwrap()
    }
    fn clear_tables(conn: &SqliteConnection) {
        diesel::delete(articles::table).execute(conn);
    }
    #[test]
    fn main() {
        let conn = connection();
        insert_test(&conn);
        update_test(&conn);
        clear_tables(&conn);
    }

    fn insert_test(conn: &SqliteConnection) {
        clear_tables(conn);
        let all_articles = Article::select_all(conn).len();
        let data = NewArticle {
            title: "test".to_string(),
            slug: "a-h-o".to_string(),
            content: "uoooo".to_string(),
            published: true,
        };
        let created_count = Article::insert(data.clone(), conn);
        let subject: Article = articles_dsl::articles
            .order(articles::id.desc())
            .first::<Article>(conn)
            .unwrap();
        assert_eq!(created_count, 1);
        assert_eq!(&subject.title, &data.title);
        assert_eq!(&subject.slug, &data.slug);
        assert_eq!(&subject.content, &data.content);
        assert_eq!(&subject.published, &data.published);
        assert_eq!(Article::select_all(conn).len(), all_articles + 1);
    }

    fn update_test(conn: &SqliteConnection) {
        clear_tables(&conn);
        let data1 = NewArticle {
            title: "one".to_string(),
            slug: "o-n-e".to_string(),
            content: "hoge".to_string(),
            published: false,
        };
        let data2 = NewArticle {
            title: "two".to_string(),
            slug: "t-w-o".to_string(),
            content: "fuga".to_string(),
            published: false,
        };
        for x in vec![data1.clone(), data2.clone()] {
            Article::insert(x, &conn);
        }
        let target = {
            let x = articles_dsl::articles
                .filter(articles::title.eq(&data1.title))
                .get_result::<Article>(conn)
                .unwrap();
            Article {
                id: x.id,
                title: "solami".to_string(),
                slug: "so-la-mi".to_string(),
                content: "laala".to_string(),
                published: true,
                created_at: x.created_at,
            }
        };
        let result = Article::update(target.clone(), &conn);
        let updated = Article::select(*&target.id, &conn);
        assert_eq!(result, 1);
        assert_eq!(target, updated);
    }
}
