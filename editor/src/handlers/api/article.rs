use rocket_contrib::Json;
use models::{Article, NewArticle, ExistingArticle, Tagging, Tag};
use db::Conn;

#[get("/articles")]
fn fetch(conn: Conn) -> Json<Vec<Article>> {
    Json(Article::select_all(&conn))
}

#[get("/articles/<id>")]
fn one(id: i32, conn: Conn) -> Json<Article> {
    Json(Article::select(id, &conn))
}

#[get("/articles/<id>/tags")]
fn tags(id: i32, conn: Conn) -> Json<Vec<Tag>> {
    Json(Tagging::tags_by_article(id, &conn))
}

#[post("/articles", format = "application/json", data = "<article>")]
fn create(article: Json<NewArticle>, conn: Conn) -> Json<usize> {
    Json(Article::insert(&article.into_inner(), &conn))
}

#[put("/articles/<id>", format = "application/json", data = "<article>")]
fn update(id: i32, article: Json<ExistingArticle>, conn: Conn) -> Json<usize> {
    Json(Article::update(id, &article.into_inner(), &conn))
}

#[delete("/articles/<id>")]
fn delete(id: i32, conn: Conn) -> Json<usize> {
    Json(Article::delete(id, &conn))
}
