#![recursion_limit="128"]
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_infer_schema;
extern crate dotenv;
extern crate iron;
extern crate handlebars_iron as hbs;
extern crate serde_json;

pub mod models;
pub mod handlers;
