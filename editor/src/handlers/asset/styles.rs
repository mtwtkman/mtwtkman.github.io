use rocket::response::NamedFile;
use std::path::PathBuf;
use super::asset;


#[get("/styles/<path..>")]
fn handler(path: PathBuf) -> Option<NamedFile> {
    asset("styles", path)
}
