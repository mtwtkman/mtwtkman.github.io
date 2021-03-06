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

#[cfg(test)]
mod tests;

fn main() {
    let pool = db::init_pool();
    rocket::ignite()
        .manage(pool)
        .mount("/", routes![handlers::page::index::handler])
        .mount("/asset/", routes![
            handlers::asset::javascript::handler,
            handlers::asset::style::handler,
        ])
        .mount("/api/", routes![
            handlers::api::article::fetch,
            handlers::api::article::tags,
            handlers::api::article::one,
            handlers::api::article::create,
            handlers::api::article::update,
            handlers::api::article::delete,
            handlers::api::tag::fetch,
        ])
        .launch();
}
