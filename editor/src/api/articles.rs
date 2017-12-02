extern crate iron;

use iron::prelude::*;
use iron::status;

pub fn index(_: &mut Request) -> IronResult<Response> {
    Ok(Response::with((status::Ok, "{response: \"articles API\"}")))
}
