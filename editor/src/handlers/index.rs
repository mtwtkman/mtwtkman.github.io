use iron::prelude::*;
use iron::{status, Response};
use hbs::Template;
use serde_json::value::{Value, Map};

use models::Article;

pub fn handler(_: &mut Request) -> IronResult<Response> {
    let mut resp = Response::new();
    let row: Vec<Article> = Article::select_all();
    let mut data: Map<String, Value> = Map::new();
    data.insert("articles".to_string(), json!(&row));
    resp.set_mut(Template::new("index", data)).set_mut(status::Ok);
    Ok(resp)
}
