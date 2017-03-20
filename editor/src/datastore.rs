use std::collections::HashMap;
use std::path::PathBuf;
use std::io::prelude::*;
use std::fs::File;

use serde_yaml::from_str;
use serde_json::value::{Value, ToJson};


#[derive(Serialize, Deserialize, Debug, PartialEq)]
pub struct Article {
    pub slug: String,
    pub title: String,
    pub year: i32,
    pub month: i32,
    pub day: i32,
}

impl ToJson for Article {
    pub fn to_json(&self) -> Result<Value, Error> {
        Ok();
    }
}

#[derive(Serialize, Deserialize, Debug, PartialEq)]
pub struct Tag {
    pub path: String,
    pub title: String,
}

#[derive(Serialize, Deserialize, Debug, PartialEq)]
pub struct Content {
    pub title: String,
    pub slug: String,
    pub date: String,
    pub tags: Vec<String>,
    pub publish: bool,
    pub body: String,
}

fn read_file(path_string: &str) -> String {
    let mut p = PathBuf::from("./src/data");
    p.push(path_string.to_string());
    let mut f = File::open(p).unwrap();
    let mut data = String::new();
    let _ = f.read_to_string(&mut data);
    data
}

pub fn articles() -> Vec<Article> {
    from_str(&read_file(&"index.yml")).unwrap()
}

pub fn tags() -> HashMap<String, Vec<Tag>> {
    from_str(&read_file(&"tagging.yml")).unwrap()
}

#[cfg(test)]
mod tests {
    use std::collections::HashMap;

    use serde_yaml::from_str;

    use super::{read_file, Article, Tag, Content};

    #[test]
    fn test_read_file() {
        let data = read_file(&"test/hoge.txt");
        assert!(data.contains("this is test."));
    }

    #[test]
    fn test_article() {
        let data = read_file(&"test/articles.yml");
        let result: Vec<Article> = from_str(&data).unwrap();
        let expected = vec![
            Article {
                slug: "hoge-slug".to_string(),
                title: "hoge-title".to_string(),
                year: 2017,
                month: 1,
                day: 1,
            },
            Article {
                slug: "fuga-slug".to_string(),
                title: "fuga-title".to_string(),
                year: 2017,
                month: 12,
                day: 31,
            },
        ];
        assert_eq!(result, expected);
    }

    #[test]
    fn test_tag() {
        let data = read_file(&"test/tags.yml");
        let result: HashMap<String, Vec<Tag>> = from_str(&data).unwrap();
        let mut expected = HashMap::new();
        expected.insert("animal".to_string(), vec![
            Tag {
                path: "path/to/dog".to_string(),
                title: "dog".to_string(),
            },
            Tag {
                path: "path/to/cat".to_string(),
                title: "cat".to_string(),
            },
        ]);
        expected.insert("vegetable".to_string(), vec![
            Tag {
                path: "path/to/tomato".to_string(),
                title: "tomato".to_string(),
            },
            Tag {
                path: "path/to/potato".to_string(),
                title: "potato".to_string(),
            },
        ]);
        assert_eq!(result, expected);
    }

    #[test]
    fn test_content() {
        let data = read_file(&"test/content.yml");
        let result: Content = from_str(&data).unwrap();
        let expected = Content {
            title: "hoge".to_string(),
            slug: "h-o-g-e".to_string(),
            date: "2017/01/01 12:00:00".to_string(),
            tags: vec!["a".to_string(), "b".to_string()],
            publish: true,
            body: "this\nis\nbody".to_string(),
        };
        assert_eq!(result, expected);
    }
}
