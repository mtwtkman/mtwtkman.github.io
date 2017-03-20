extern crate iron;
extern crate router;
#[cfg(test)]
extern crate iron_test;
extern crate serde;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate serde_json;

use std::io::prelude::*;
use std::fs::File;

use iron::prelude::*;
use iron::mime::Mime;
use iron::status;
use router::Router;

mod api;
mod model;


fn index(_: &mut Request) -> IronResult<Response> {
    let mut f = File::open("./src/index.html").unwrap();
    let mut s = String::new();
    let _ = f.read_to_string(&mut s);
    let content_type = "text/html".parse::<Mime>().unwrap();
    Ok(Response::with((content_type, status::Ok, s)))
}

fn main() {
    let mut router = Router::new();
    router.get("/", index, "index");
    router.get("/api/articles", api::articles, "articles");
    router.get("/api/articles/:year/:month/:day/:slug", api::article, "article");
    router.get("/api/tags", api::tags, "tags");
    Iron::new(router).http("0.0.0.0:3000").unwrap();
}

#[cfg(test)]
mod tests {
    use iron::status;
    use iron::headers::{Headers};
    use iron_test::{request, response};

    use super::{index, read_file};

    #[test]
    fn test_index() {
        let response = request::get("http://localhost:3000", Headers::new(), &index).unwrap();
        assert_eq!(response.status.unwrap(), status::Ok);
        assert!(response::extract_body_to_string(response).contains("<!doctype html>"));
    }
}
