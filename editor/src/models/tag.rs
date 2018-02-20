use diesel;
use diesel::prelude::*;

mod schema {
    table! {
        tags {
            name -> Text,
        }
    }
}

use self::schema::tags;
use self::schema::tags::{dsl as tags_dsl};

#[derive(Deserialize, Serialize, Insertable, AsChangeset, Queryable)]
#[table_name = "tags"]
pub struct Tag {
    pub name: String,
}


