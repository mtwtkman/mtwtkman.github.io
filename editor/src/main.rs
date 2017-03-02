extern crate iron;
#[macro_use]
extern crate router;
#[macro_use]
extern crate tera;
extern crate iron_tera;

use iron::prelude::*;
use iron::status;
use tera::Tera;

fn index(_: &mut Request) -> IronResult<Response> {
    Ok(Response::with((status::Ok, "hello")))
}

fn main() {
    let tera = compiletemplates!("templates/**/*");
    let router = router!(index: get "/" => index);
    Iron::new(router).http("0.0.0.0:3000").unwrap();
}
