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

use std::io::prelude::*;
use std::fs::File;

use iron::prelude::*;
use iron::status;
use iron::headers::ContentType;
use router::Router;

mod datastore;


fn index(_: &mut Request) -> IronResult<Response> {
    let mut f = File::open("./src/index.html").unwrap();
    let mut s = String::new();
    let _ = f.read_to_string(&mut s);
    Ok(Response::with((status::Ok, s)))
}

// fn articles_list(_: &mut Request) -> IronResult<Response> {
//     let articles = datastore::articles().unwrap();
//     Ok(Response::with((status::Ok, articles)));
// }

fn main() {
    let mut router = Router::new();
    router.get("/", index, "index");
    Iron::new(router).http("0.0.0.0:3000").unwrap();
}

#[cfg(test)]
mod tests {
    use iron::status;
    use iron::headers::{Headers, ContentType};
    use iron_test::{request, response};
    use serde_json;

    use super::index;

    #[test]
    fn test_index() {
        let response = request::get("http://localhost:3000", Headers::new(), &index).unwrap();
        assert_eq!(response.status.unwrap(), status::Ok);
        assert!(response::extract_body_to_string(response).contains("<!doctype html>"));
    }

    // #[test]
    // fn test_json_response() {
    //     let data = json!({
    //         "title": "Title",
    //         "date": "2017/1/1",
    //     });
    //     let resp = JsonResponse::with((status::Ok, data));
    //     let content_type = ContentType.json();
    //     assert_eq!(resp.headers.get::<ContentType>().unwrap(), content_type);
    // }
}
