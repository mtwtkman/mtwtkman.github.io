use std::path::PathBuf;
use std::io::prelude::*;
use std::fs::{create_dir_all, File};

use iron::prelude::*;
use iron::mime::Mime;
use iron::status;
use router::Router;
use serde_json::{Value, from_str};

fn json_response(body: String) -> IronResult<Response> {
    let content_type = "application/json".parse::<Mime>().unwrap();
    Ok(Response::with((content_type, status::Ok, body)))
}

fn read_file(file_name: &str) -> String {
    let mut file = File::open(file_name).unwrap();
    let mut contents = String::new();
    file.read_to_string(&mut contents);
    contents
}

pub fn articles(_: &mut Request) -> IronResult<Response> {
    json_response(read_file("index.json"))
}

#[derive(Serialize, Deserialize)]
struct Article {
    title: String,
    body: String,
    slug: String,
    publish: bool,
    tags: Vec<String>,
    date: String,
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

pub fn tag(request: &mut Request) -> IronResult<Response> {
    let tag_name = request.extensions.get::<Router>().unwrap().find("name").unwrap_or("").to_string();
    let s: Value = from_str(&read_file("tagging.json")).unwrap();
    let tagged: &Value = s.get(tag_name).unwrap();
    json_response(tagged.to_string())
}
