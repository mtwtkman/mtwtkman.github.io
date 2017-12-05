use iron::prelude::*;
use iron::{status, Response};
use router::Router;
use hbs::Template;

use models::EditArticle;

pub fn handler(req: &mut Request) -> IronResult<Response> {
    let id: i32 = req
        .extensions
        .get::<Router>()
        .unwrap()
        .find("id")
        .expect("Article id not found")
        .parse::<i32>()
        .unwrap();
    let mut resp = Response::new();
    let data = EditArticle::select(id);
    resp.set_mut(Template::new("edit", json!(&data))).set_mut(status::Ok);
    Ok(resp)
}
