extern crate iron;
#[macro_use]
extern crate router;
#[macro_use]
extern crate serde_json;
extern crate handlebars_iron as hbs;

use iron::prelude::*;
use hbs::{HandlebarsEngine, DirectorySource};
#[cfg(feature = "watch")]
use hbs::Watchable;
#[cfg(feature = "watch")]
use std::sync::Arc;

mod handlers;
use handlers::index;

#[cfg(feature = "watch")]
fn main() {
    let template_path = "./templates/";
    let mut hbse = HandlebarsEngine::new();
    hbse.add(Box::new(DirectorySource::new(template_path, ".hbs")));
    if let Err(r) = hbse.reload() {
        panic!("{}", r);
    }
    let hbse_ref = Arc::new(hbse);
    hbse_ref.watch(template_path);

    let router = router!(
        index: get "/" => index::handler,
    );

    let mut chain = Chain::new(router);
    chain.link_after(hbse_ref);

    Iron::new(chain).http("0.0.0.0:3000").unwrap();
}
