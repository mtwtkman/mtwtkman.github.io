extern crate diesel;
extern crate r2d2;
extern crate r2d2_diesel;

use db::init_pool;
use diesel::prelude::*;
use r2d2::PooledConnection;
use r2d2_diesel::ConnectionManager;

pub fn connection() -> PooledConnection<ConnectionManager<SqliteConnection>> {
    init_pool().get().unwrap()
}
