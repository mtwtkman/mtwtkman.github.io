use diesel;
use diesel::prelude::*;
use chrono::prelude::*;

mod schema {
    table! {
        articles {
            id -> Integer,
            title -> Text,
            slug -> Text,
            body -> Text,
            published -> Bool,
            created_at -> Timestamp,
        }
    }
}

pub use self::schema::articles;
pub use self::schema::articles::dsl;

#[derive(Clone, Serialize, Queryable, Identifiable)]
#[table_name = "articles"]
pub struct Article {
    pub id: i32,
    pub title: String,
    pub slug: String,
    pub body: String,
    pub published: bool,
    pub created_at: NaiveDateTime,
}

#[derive(Deserialize, Serialize, AsChangeset)]
#[table_name = "articles"]
pub struct ExistingArticle {
    pub title: String,
    pub slug: String,
    pub body: String,
    pub published: bool,
}

#[derive(Deserialize, Insertable)]
#[table_name = "articles"]
pub struct NewArticle {
    pub title: String,
    pub slug: String,
    pub body: String,
    pub published: bool,
}

impl Article {
    pub fn select_all(conn: &SqliteConnection) -> Vec<Article> {
        dsl::articles
            .order(articles::created_at.desc())
            .load::<Article>(conn)
            .unwrap()
    }

    pub fn select(pk: i32, conn: &SqliteConnection) -> Article {
        dsl::articles
            .find(pk)
            .get_result::<Article>(conn)
            .unwrap()
    }

    pub fn insert(data: &NewArticle, conn: &SqliteConnection) -> usize {
        diesel::insert_into(articles::table)
            .values(data)
            .execute(conn)
            .unwrap()
    }

    pub fn update(id: i32, data: &ExistingArticle, conn: &SqliteConnection) -> usize {
        diesel::update(dsl::articles.filter(articles::id.eq(id)))
            .set(data)
            .execute(conn)
            .unwrap()
    }

    pub fn delete(id: i32, conn: &SqliteConnection) -> usize {
        diesel::delete(dsl::articles.filter(articles::id.eq(id)))
            .execute(conn)
            .unwrap()
    }
}

#[cfg(test)]
mod tests {
    use tests::*;
    use super::*;

    fn clear_table(conn: &SqliteConnection) {
        diesel::delete(articles::table).execute(conn);
    }

    #[test]
    fn creates_new_article() {
        let conn = connection();
        clear_table(&*conn);
        let all_articles = Article::select_all(&conn).len();
        let data = NewArticle {
            title: "test".to_string(),
            slug: "a-h-o".to_string(),
            body: "uoooo".to_string(),
            published: true,
        };
        let created_count = Article::insert(&data, &conn);
        let subject: Article = dsl::articles
            .order(articles::id.desc())
            .first::<Article>(&*conn)
            .unwrap();
        assert_eq!(created_count, 1);
        assert_eq!(&subject.title, &data.title);
        assert_eq!(&subject.slug, &data.slug);
        assert_eq!(&subject.body, &data.body);
        assert_eq!(&subject.published, &data.published);
        assert_eq!(Article::select_all(&conn).len(), all_articles + 1);
        clear_table(&*conn);
    }

    #[test]
    fn updates_certain_article() {
        let conn = connection();
        clear_table(&*conn);
        for x in vec![
            ("one", "o-n-e", "hoge", false),
            ("two", "t-w-o", "fuga", false),
        ] {
            Article::insert(&NewArticle {
                title: x.0.to_owned(),
                slug: x.1.to_owned(),
                body: x.2.to_owned(),
                published: x.3,
            }, &conn);
        }
        let updated: Article = dsl::articles
            .filter(articles::title.eq("one"))
            .get_result::<Article>(&*conn)
            .unwrap();
        let target = ExistingArticle {
            title: "updated".to_string(),
            slug: "u-p-dated".to_string(),
            body: "hi".to_string(),
            published: true,
        };
        let result = Article::update(*&updated.id, &target, &conn);
        let subject = Article::select(*&updated.id, &conn);
        assert_eq!(result, 1);
        assert_eq!(&target.title, &subject.title);
        assert_eq!(&target.slug, &subject.slug);
        assert_eq!(&target.body, &subject.body);
        assert_eq!(&target.published, &subject.published);
        clear_table(&*conn);
    }

    #[test]
    fn deletes_an_artcile() {
        let conn = connection();
        clear_table(&*conn);
        let title = "mirei";
        Article::insert(&NewArticle {
            title: title.to_string(),
            slug: "3-7-3".to_string(),
            body: "go go mirei".to_string(),
            published: true,
        }, &conn);
        let created_id: i32 = dsl::articles
            .filter(articles::title.eq(title))
            .get_result::<Article>(&*conn)
            .unwrap()
            .id;
        Article::delete(created_id, &conn);
        assert_eq!(Article::select_all(&conn).len(), 0);
        clear_table(&*conn);
    }
}
