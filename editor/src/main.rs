extern crate iron;
#[macro_use(router)]
extern crate router;
// #[macro_use]
// extern crate tera;
// extern crate iron_tera;
extern crate handlebars_iron;
extern crate handlebars;
extern crate serde_json;

use iron::prelude::*;
use iron::status;
use router::Router;
// use tera::Context;
// use iron_tera::{Template, TeraEngine, TemplateMode};
use handlebars_iron::{Template, HandlebarsEngine, DirectorySource};
use serde_json::value::{Value, Map};
use handlebars::to_json;

fn make_data() -> Map<String, Value> {
    let mut data = Map::new();
    data.insert("key".to_string(), Value::String("hoge".to_string()));
    data
}

fn index(_: &mut Request) -> IronResult<Response> {
    let mut resp = Response::new();
    let data: Map<String, Value> = make_data();
    resp.set_mut(Template::new("index", data)).set_mut(status::Ok);
    Ok(resp)
}

fn main() {
    let router = router!(index: get "/" => index);
    let mut hbse = HandlebarsEngine::new();
    hbse.add(Box::new(DirectorySource::new("./templates/", ".hbs")));
    let mut chain = Chain::new(router);
    chain.link_after(hbse);
    Iron::new(chain).http("0.0.0.0:3000").unwrap();
}
