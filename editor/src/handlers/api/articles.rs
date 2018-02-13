use rocket_contrib::Json;

use models::Article;
use db::Conn;

#[get("/articles")]
fn fetch(conn: Conn) -> Json<Vec<Article>> {
    Json(Article::select_all(&conn))
}

#[get("/articles/<id>")]
fn one(id: i32, conn: Conn) -> Json<Article> {
    Json(Article::select(id, &conn))
}
