extern crate iron;

use iron::prelude::*;
use iron::mime::Mime;
use iron::status;

pub fn index(_: &mut Request) -> IronResult<Response> {
    Ok(Response::with((content_type, status::Ok, "{response: \"articles API\"}")))
}
