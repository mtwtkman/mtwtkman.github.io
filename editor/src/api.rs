use std::path::PathBuf;
use std::io::prelude::*;
use std::fs::File;

use iron::prelude::*;
use iron::mime::Mime;
use iron::status;
use router::Router;


fn read_file<'a>(path_string: &'a str) -> String {
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
    fn _param<'a>(x: &'a str, r: &'a Request) -> &'a str {
        r.extensions.get::<Router>().unwrap().find(x).unwrap_or("")
    }
    let mut filename = _param("slug", &request).to_string();
    filename.push_str(".json");
    let s = [
        _param("year", &request),
        _param("month", &request),
        _param("day", &request),
        &filename,
    ].join("/");
    json_response(read_file(&s))
}

pub fn tags(_: &mut Request) -> IronResult<Response> {
    json_response(read_file("tagging.json"))
}
