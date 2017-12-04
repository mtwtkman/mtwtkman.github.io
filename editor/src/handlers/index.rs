use iron::prelude::*;
use iron::{status, Response};
use hbs::Template;
use serde_json::value::{Value, Map};
use diesel::prelude::*;

use models::{establish_connection};
use models::Article;

pub fn handler(_: &mut Request) -> IronResult<Response> {
    let mut resp = Response::new();
    let mut data: Map<String, Value> = Map::new();
    let row = Article::select_all();
    println!("{}", row.len());
    resp.set_mut(Template::new("index", data)).set_mut(status::Ok);
    Ok(resp)
}
