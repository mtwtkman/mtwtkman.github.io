use rocket_contrib::Json;
use models::{Article, NewArticle, ExistingArticle, Tagging, Tag};
use db::Conn;
use chrono::prelude::*;


#[derive(Serialize)]
struct ArticleWithoutTag {
    id: i32,
    title: String,
    slug: String,
    published: bool,
    created_at: NaiveDateTime,
}

#[get("/articles")]
fn fetch(conn: Conn) -> Json<Vec<ArticleWithoutTag>> {
    let articles: Vec<ArticleWithoutTag> = Article::select_all(&conn)
        .iter()
        .map(|ref a|
            ArticleWithoutTag {
                id: a.clone().id,
                title: a.clone().title.to_owned(),
                slug: a.clone().slug.to_owned(),
                published: a.clone().published,
                created_at: a.clone().created_at,
            }
        )
        .collect();
    Json(articles)
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
