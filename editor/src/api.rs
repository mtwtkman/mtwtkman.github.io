use std::path::PathBuf;
use std::io::prelude::*;
use std::fs::File;
use std::error::Error;
use std::fmt::{self, Debug};

use iron::prelude::*;
use iron::mime::Mime;
use iron::status;
use router::Router;
use serde_json::{to_string ,from_str};

use model::Article;


#[derive(Debug)]
struct NotFoundError(&'static str);

impl fmt::Display for NotFoundError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        Debug::fmt(self, f)
    }
}

impl Error for NotFoundError {
    fn description(&self) -> &str { &*self.0  }
}

fn read_file(path_string: &str) -> String {
    let mut p = PathBuf::from("./src/data");
    p.push(path_string.to_string());
    let mut f = File::open(p).unwrap();
    let mut data = String::new();
    let _ = f.read_to_string(&mut data);
    data
}

fn json_response(body: String) -> IronResult<Response> {
    let content_type = "application/json".parse::<Mime>().unwrap();
    Ok(Response::with((content_type, status::Ok, body)))
}

pub fn articles(_: &mut Request) -> IronResult<Response> {
    json_response(read_file("index.json"))
}

pub fn article(request: &mut Request) -> IronResult<Response> {
    fn _param(x: &str, r: &Request) -> &str { r.extensions.get::<Router>().unwrap().find(x).unwrap_or("") }
    let mut s = String::new();
    s = _param("year", request) +
        "/" +
        _param("month", request) +
        "/" +
        _param("day", request) +
        "/" +
        _param("slug", request) +
        ".json";
    json_response(read_file(s))
}

pub fn tags(_: &mut Request) -> IronResult<Response> {
    json_response(read_file("tagging.json"))
}
