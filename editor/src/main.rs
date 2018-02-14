#![feature(plugin, custom_attribute)]
#![plugin(rocket_codegen)]

extern crate rocket;
extern crate rocket_contrib;
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_derives;
#[macro_use]
extern crate serde_derive;
extern crate r2d2;
extern crate r2d2_diesel;
extern crate chrono;

mod handlers;
mod models;
mod db;


fn main() {
    let pool = db::init_pool();
    rocket::ignite()
        .manage(pool)
        .mount("/", routes![handlers::index::handler])
        .mount("/asset/", routes![
            handlers::asset::javascripts::handler,
            handlers::asset::styles::handler,
        ])
        .mount("/api/", routes![
            handlers::api::articles::fetch,
            handlers::api::articles::one,
            handlers::api::articles::create,
        ])
        .launch();
}
