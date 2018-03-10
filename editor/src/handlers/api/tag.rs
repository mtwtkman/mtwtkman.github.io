use rocket_contrib::Json;
use models::{Tag};
use db::Conn;

#[get("/tags")]
fn fetch(conn: Conn) -> Json<Vec<Tag>> {
    Json(Tag::select_all(&conn))
}
