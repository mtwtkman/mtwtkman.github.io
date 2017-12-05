use std::collections::BTreeMap;

use iron::prelude::*;
use iron::{status, Response};
use hbs::Template;
use serde_json::value::{Value, Map};
use diesel::prelude::*;

use models::{establish_connection};
use models::Article;

pub fn handler(_: &mut Request) -> IronResult<Response> {
    let mut resp = Response::new();
    let row: Vec<Article> = Article::select_all();
    let mut data: BTreeMap<String, Value> = BTreeMap::new();
    data.insert("articles".to_string(), json!(&row));
    resp.set_mut(Template::new("index", data)).set_mut(status::Ok);
    Ok(resp)
}
