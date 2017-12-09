use models::schema::taggings;
use models::Article;
use models::Tag;


#[derive(Identifiable, Queryable, Associations)]
#[belongs_to(Article)]
#[belongs_to(Tag)]
pub struct Tagging {
    id: i32,
    article_id: i32,
    tag_id: i32,
}
