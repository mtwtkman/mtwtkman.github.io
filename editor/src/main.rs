extern crate iron;
extern crate router;
#[cfg(test)]
extern crate iron_test;
extern crate serde;
#[macro_use]
extern crate serde_derive;
extern crate serde_yaml;
#[macro_use]
extern crate serde_json;
extern crate iron_json_response;

use std::io::prelude::*;
use std::fs::File;

use iron::prelude::*;
use iron::mime::Mime;
use iron::status;
use router::Router;
use iron_json_response::{JsonResponseMiddleware, JsonResponse};

mod datastore;

fn json_response(body: String) -> IronResult<Response> {
    let content_type = "application/json".parse::<Mime>().unwrap();
    Ok(Response::with((content_type, status::Ok, body)));
}

fn index(_: &mut Request) -> IronResult<Response> {
    let mut f = File::open("./src/index.html").unwrap();
    let mut s = String::new();
    let _ = f.read_to_string(&mut s);
    let content_type = "text/html".parse::<Mime>().unwrap();
    Ok(Response::with((content_type, status::Ok, s)))

}

fn articles(_: &mut Request) -> IronResult<Response> {
    let data: Vec<datastore::Article> = datastore::articles();
    json_response(body)
}

fn main() {
    let mut router = Router::new();
    router.get("/", index, "index");
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
