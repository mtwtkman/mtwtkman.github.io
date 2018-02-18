use rocket_contrib::Json;

use models::{Article, NewArticle};
use db::Conn;

#[get("/articles")]
fn fetch(conn: Conn) -> Json<Vec<Article>> {
    Json(Article::select_all(&conn))
}

#[get("/articles/<id>")]
fn one(id: i32, conn: Conn) -> Json<Article> {
    Json(Article::select(id, &conn))
}

#[post("/articles", format = "application/json", data = "<article>")]
fn create(article: Json<NewArticle>, conn: Conn) -> Json<usize> {
    Json(Article::insert(article.into_inner(), &conn))
}
