use std::io;
use rocket::response::NamedFile;

#[get("/")]
pub fn handler() -> io::Result<NamedFile> {
    NamedFile::open("static/index.html")
}
