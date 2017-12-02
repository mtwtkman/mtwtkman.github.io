#[derive(Queryable)]
pub struct Article {
    pub id: i32,
    pub title: String,
    pub slug: String,
    pub published: bool,
    pub year: String,
    pub day: String,
    pub month: String,
}
