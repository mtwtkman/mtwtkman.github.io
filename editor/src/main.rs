extern crate iron;
extern crate router;
extern crate hyper;

use std::fs::File;
use std::io::prelude::*;

use iron::prelude::*;
use iron::mime::{Mime, TopLevel, SubLevel, Attr, Value};
use iron::{AfterMiddleware, status};
use iron::headers::ContentType;
use router::Router;

fn index(_: &mut Request) -> IronResult<Response> {
    let mut file = File::open("./assets/index.html").unwrap();
    let mut contents = String::new();
    let content_type: Mime = "text/html".parse().unwrap();
    let _ = file.read_to_string(&mut contents);
    Ok(Response::with((content_type, status::Ok, contents)))
}

struct JsonResponseMiddleware;
impl AfterMiddleware for JsonResponseMiddleware {
    fn after(&self, _: &mut Request, mut res: Response) -> IronResult<Response> {
        res.headers.set(
            ContentType(Mime(
                TopLevel::Application,
                SubLevel::Json,
                vec![(Attr::Charset, Value::Utf8)]
            ))
        );
        Ok(res)
    }
}

mod api;

fn main() {
    let mut router = Router::new();
    router.get("/", index, "index");
    let mut articles_index_chain = Chain::new(api::articles::index);
    articles_index_chain.link_after(JsonResponseMiddleware);
    router.get("/api/articles", articles_index_chain, "articles");
    Iron::new(router).http("0.0.0.0:3000").unwrap();
}
