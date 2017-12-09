use models::schema::taggings;

#[derive(Identifiable, Queryable)]
pub struct Tagging {
    id: i32,
    article_id: i32,
    tag_id: i32,
}
