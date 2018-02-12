use rocket::response::NamedFile;
use std::path::PathBuf;
use super::asset;


#[get("/javascripts/<path..>")]
pub fn handler(path: PathBuf) -> Option<NamedFile> {
    asset("javascripts", path)
}
