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
    pub id: i32,
    pub title: String,
    pub slug: String,
    pub content: String,
    pub published: bool,
    pub year: String,
    pub month: String,
    pub day: String,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct ArticleData {
    pub title: String,
    pub slug: String,
    pub content: String,
    pub published: bool,
}

impl Article {
    pub fn select_all(conn: &SqliteConnection) -> Vec<Article> {
        articles_dsl::articles
            .order(
                (
                    articles::year.desc(),
                    articles::month.desc(),
                    articles::day.desc()
                )
            )
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
        let next_id: i32 = match articles_dsl::articles
            .order(articles::id.desc())
            .first::<Article>(conn) {
            Ok(a) => a.id + 1,
            Err(_) => 1,
        };
        let t = Article {
            id: next_id,
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
        let data = ArticleData {
            title: "test".to_string(),
            slug: "a-h-o".to_string(),
            content: "uoooo".to_string(),
            published: true,
        };
        Article::insert(data.clone(), &conn);
        let subject: Article = articles_dsl::articles
            .order(articles::id.desc())
            .first::<Article>(&*conn)
            .unwrap();
        assert_eq!(subject.title, data.title);
        assert_eq!(subject.slug, data.slug);
        assert_eq!(subject.content, data.content);
        assert_eq!(subject.published, data.published);
        assert_eq!(subject.id, 1);
        clear_tables(&conn);
    }
}
