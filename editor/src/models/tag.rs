use models::schema::tags;

#[derive(Identifiable, Queryable)]
pub struct Tag {
    pub id: i32,
    pub name: String,
}
