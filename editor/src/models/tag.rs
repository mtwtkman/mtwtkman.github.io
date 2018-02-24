use diesel;
use diesel::prelude::*;

mod schema {
    table! {
        tags (name) {
            name -> Text,
        }
    }
}

use self::schema::tags;
use self::schema::tags::{dsl as tags_dsl};

#[derive(Deserialize, Serialize, Insertable, Queryable)]
#[table_name = "tags"]
pub struct Tag {
    pub name: String,
}

impl Tag {
    pub fn select_all(conn: &SqliteConnection) -> Vec<Tag> {
        tags_dsl::tags
            .order(tags::name.asc())
            .load::<Tag>(conn)
            .unwrap()
    }

    pub fn select(name: String, conn: &SqliteConnection) -> Tag {
        tags_dsl::tags
            .find(name)
            .get_result::<Tag>(conn)
            .unwrap()
    }

    pub fn insert(name: String, conn: &SqliteConnection) -> usize {
        diesel::insert_into(tags::table)
            .values(&tags::name.eq(name))
            .execute(conn)
            .unwrap()
    }

    pub fn update(original_name: String, new_name: String, conn: &SqliteConnection) -> usize {
        diesel::update(tags_dsl::tags.filter(tags::name.eq(&original_name)))
            .set(tags::name.eq(&new_name))
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
        init_pool().get().unwrap()
    }

    fn clear_tables(conn: &SqliteConnection) {
        diesel::delete(tags::table).execute(conn);
    }
    #[test]
    fn creates_new_tag() {
        let conn = connection();
        clear_tables(&*conn);
        let all_tags = Tag::select_all(&conn).len();
        let name = "hoge";
        let result = Tag::insert(name.to_string(), &conn);
        let subject = Tag::select(name.to_string(), &conn);
        assert_eq!(result, 1);
        assert_eq!(subject.name, name);
        assert_eq!(Tag::select_all(&conn).len() - all_tags, 1);
        clear_tables(&*conn);
    }

    #[test]
    fn updates_a_tag() {
        let conn = connection();
        clear_tables(&*conn);
        let all_tags = Tag::select_all(&conn).len();
        let n1 = "hoge";
        let n2 = "fuga";
        Tag::insert(n1.to_string(), &conn);
        Tag::update(n1.to_string(), n2.to_string(), &conn);
        assert_eq!(Tag::select(n2.to_string(), &conn).name, n2);
        clear_tables(&*conn);
    }
}
