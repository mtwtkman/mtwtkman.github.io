extern crate iron;
#[macro_use]
extern crate router;
extern crate tera;
extern crate iron_tera;
#[cfg(test)]
extern crate iron_test;

use iron::prelude::*;
use iron::status;
use tera::Context;
use iron_tera::{TeraEngine, Template, TemplateMode};

fn index(_: &mut Request) -> IronResult<Response> {
    let mut response = Response::new();
    let mut context = Context::new();
    context.add("data", &"This is data");
    response.set_mut(Template::new("index.html", TemplateMode::from_context(context)))
            .set_mut(status::Ok);
    Ok(response)
}

fn main() {
    let router = router!(index: get "/" => index);
    let mut chain = Chain::new(router);
    let teng = TeraEngine::new("/source/src/templates/**/*");
    chain.link_after(teng);
    Iron::new(chain).http("0.0.0.0:3000").unwrap();
}

#[cfg(test)]
mod tests {
    use iron::status;
    use iron::headers::Headers;
    use iron_test::request;

    use super::index;

    #[test]
    fn test_index() {
        let response = request::get("http://localhost:3000", Headers::new(), &index).unwrap();
        assert_eq!(response.status.unwrap(), status::Status::Ok);
    }
}
