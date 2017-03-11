use std::path::PathBuf;
use std::io::prelude::*;
use std::fs::File;

use serde_yaml;


#[derive(Serialize, Deserialize)]
pub struct Article {
    pub slug: String,
    pub title: String,
    pub year: i8,
    pub month: i8,
    pub day: i8,
}

#[derive(Serialize, Deserialize)]
pub struct Articles(pub Vec<Article>);

#[derive(Serialize, Deserialize)]
pub struct Tag {
    pub path: String,
    pub title: String,
}

#[derive(Serialize, Deserialize)]
pub struct Tags {
    pub name: Vec<Tag>
}

fn read_file(path_string: &str) -> String {
    let mut p = PathBuf::from("./src/data");
    p.push(path_string.to_string());
    let mut f = File::open(p).unwrap();
    let mut data = String::new();
    let _ = f.read_to_string(&mut data);
    data
}

pub fn articles() -> serde_yaml::Result<Articles> {
    let parsed = read_file(&"index.yml");
    let articles: Articles = serde_yaml::from_str(&parsed).unwrap();
    Ok(articles)
}


#[cfg(test)]
mod tests {
    use super::articles;

    #[test]
    fn test_articles() {
        assert_eq!(1, 1);
    }
}
