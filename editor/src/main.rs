extern crate iron;
extern crate router;
#[cfg(test)]
extern crate iron_test;
extern crate serde;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate serde_json;

use std::io;
use std::io::prelude::*;
use std::fs::File;

use iron::prelude::*;
use iron::mime::Mime;
use iron::status;
use router::Router;

mod api;


fn read(file_path: &str) -> Result<String, io::Error> {
    File::open(file_path)
         .and_then(|mut file| {
            let mut contents = String::new();
            file.read_to_string(&mut contents)
                .map(|_| contents)
         })
         .map(|contents| contents)
}

fn index(_: &mut Request) -> IronResult<Response> {
    let content_type = "text/html".parse::<Mime>().unwrap();
    match read("./src/index.html") {
        Ok(contents) => Ok(Response::with((content_type, status::Ok, contents))),
        Err(err) => {
            Err(IronError::new(
                Box::new(err),
                (status::InternalServerError),
            ))
        }
    }
}

fn main() {
    let mut router = Router::new();
    router.get("/", index, "index");
    router.get("/api/articles", api::articles, "articles");
    // router.post("/api/articles", api::create_article, "create_article");
    router.get("/api/articles/:year/:month/:day/:slug", api::article, "article");
    router.get("/api/tags", api::tags, "tags");
    router.get("/api/tags/:name", api::tag, "tag");
    Iron::new(router).http("0.0.0.0:3000").unwrap();
}

#[cfg(test)]
mod tests {
    use iron::status;
    use iron::headers::{Headers};
    use iron_test::{request, response};

    use super::index;

    #[test]
    fn test_index() {
        let response = request::get("http://localhost:3000", Headers::new(), &index).unwrap();
        assert_eq!(response.status.unwrap(), status::Ok);
        assert!(response::extract_body_to_string(response).contains("<!doctype html>"));
    }
}
