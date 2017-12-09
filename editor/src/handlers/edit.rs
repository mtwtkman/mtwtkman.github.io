use iron::prelude::*;
use iron::{status, Response};
use router::Router;
use hbs::Template;

use models::{Article, Tag};

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
    let article = Article::select(id);
    let tags = Tag::select_related_with(&article);
    let data = json!({
        "article": &article,
        "tags": &tags,
    });
    resp.set_mut(Template::new("edit", data)).set_mut(status::Ok);
    Ok(resp)
}
