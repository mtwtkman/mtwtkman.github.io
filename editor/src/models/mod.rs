use diesel::prelude::*;
use dotenv::dotenv;
use std::env;

mod article;
pub use self::article::Article;
mod tag;
pub use self::tag::Tag;
mod tagging;
pub use self::tagging::Tagging;
pub mod schema;

pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    SqliteConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url))
}
