use rocket_contrib::Json;

use models::{Article, ArticleData};
use db::Conn;

#[get("/articles")]
fn fetch(conn: Conn) -> Json<Vec<Article>> {
    Json(Article::select_all(&conn))
}

#[get("/articles/<id>")]
fn one(id: i32, conn: Conn) -> Json<Article> {
    Json(Article::select(id, &conn))
}

#[post("/articles"), format = "application/json", data = "<article>"]
fn create(article: Json<ArticleData>, conn: Conn) -> Option<Json<Article>> {
    Article::insert(article.into_inner(), &conn).map(|x| Json(x))
}
