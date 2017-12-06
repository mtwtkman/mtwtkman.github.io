use iron::prelude::*;
use iron::{status, Response};
use router::Router;
use hbs::Template;
use pulldown_cmark::{html, Parser};

use models::Article;

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
    let mut content = String::new();
    let parser = Parser::new(article.content.as_str());
    html::push_html(&mut content, parser);
    let data = json!({
        "title": article.title,
        "slug": article.slug,
        "published": article.published,
        "year": article.year,
        "month": article.month,
        "day": article.day,
        "content": content,
    });
    resp.set_mut(Template::new("edit", data)).set_mut(status::Ok);
    Ok(resp)
}
