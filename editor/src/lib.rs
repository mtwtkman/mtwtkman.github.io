#![recursion_limit="128"]
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_infer_schema;
extern crate dotenv;
extern crate iron;
extern crate handlebars_iron as hbs;
#[macro_use]
extern crate serde_json;
#[macro_use]
extern crate serde_derive;
extern crate router;

pub mod models;
pub mod handlers;
