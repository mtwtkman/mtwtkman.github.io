use rocket::response::NamedFile;
use std::path::{Path, PathBuf};


pub fn asset(t: &str, p: PathBuf) -> Option<NamedFile> {
    NamedFile::open(
        Path::new("asset")
            .join(PathBuf::from(t))
            .join(p)
    ).ok()
}

pub mod javascripts;
pub mod styles;
