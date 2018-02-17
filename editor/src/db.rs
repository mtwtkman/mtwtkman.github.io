use std::ops::Deref;
use std::env;

use r2d2;
use diesel::sqlite::SqliteConnection;
use r2d2_diesel::ConnectionManager;
use rocket::http::Status;
use rocket::request::{self, FromRequest};
use rocket::{Request, State, Outcome};

pub type Pool = r2d2::Pool<ConnectionManager<SqliteConnection>>;

pub fn init_pool() -> Pool {
    let db_name = match env::var("EDITOR_ENV") {
        Ok(ref val) if val == "test" => "test",
        Ok(_) => "blog",
        Err(_) => "blog",
    };
    let manager = ConnectionManager::<SqliteConnection>::new(format!("{}.db", db_name));
    r2d2::Pool::new(manager).expect("db pool")
}

pub struct Conn(pub r2d2::PooledConnection<ConnectionManager<SqliteConnection>>);

impl Deref for Conn {
    type Target = SqliteConnection;

    #[inline(always)]
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl<'a, 'r> FromRequest<'a, 'r> for Conn {
    type Error = ();

    fn from_request(request: &'a Request<'r>) -> request::Outcome<Conn, ()> {
        let pool = request.guard::<State<Pool>>()?;
        match pool.get() {
            Ok(conn) => Outcome::Success(Conn(conn)),
            Err(_) => Outcome::Failure((Status::ServiceUnavailable, ())),
        }
    }
}
