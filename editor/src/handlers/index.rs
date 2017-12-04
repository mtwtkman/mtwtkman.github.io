use iron::prelude::*;
use iron::{status, Response};
use hbs::Template;
use serde_json::value::{Value, Map};
use diesel::prelude::*;

use models::{establish_connection};
use models::Article;

pub fn handler(_: &mut Request) -> IronResult<Response> {
    use models::schema::articles::dsl::*;

    let mut resp = Response::new();
    let mut data: Map<String, Value> = Map::new();
    let connection = establish_connection();
    let rows = articles.all_columns().load::<Article>(&connection).expect("Error loading articles");
    resp.set_mut(Template::new("index", data)).set_mut(status::Ok);
    Ok(resp)
}
