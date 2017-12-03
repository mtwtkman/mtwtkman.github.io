extern crate iron;
extern crate handlebars_iron as hbs;
extern crate serde_json;

use iron::prelude::*;
use iron::{status, Response};
use hbs::Template;
use self::serde_json::value::{Value, Map};

pub fn handler(_: &mut Request) -> IronResult<Response> {
    let mut resp = Response::new();

    let mut data: Map<String, Value> = Map::new();
    data.insert("title".to_string(), json!("uooooo"));
    resp.set_mut(Template::new("index", data)).set_mut(status::Ok);
    Ok(resp)
}

