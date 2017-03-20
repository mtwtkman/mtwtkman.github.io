#[derive(Serialize, Deserialize)]
pub struct Article {
    pub slug: String,
    pub title: String,
    pub year: i32,
    pub month: i32,
    pub day: i32,
}

#[derive(Serialize, Deserialize)]
pub struct Tag {
    pub path: String,
    pub title: String,
}

#[derive(Serialize, Deserialize)]
pub struct Content {
    pub title: String,
    pub slug: String,
    pub date: String,
    pub tags: Vec<String>,
    pub publish: bool,
    pub body: String,
}
