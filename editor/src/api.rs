use std::path::PathBuf;
use std::io::prelude::*;
use std::fs::File;

use iron::prelude::*;
use iron::mime::Mime;
use iron::status;


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

pub fn articles_list(_: &mut Request) -> IronResult<Response> {
    json_response(read_file(&"index.json"))
}
