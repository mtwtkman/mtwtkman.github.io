module Page.Blog.View exposing (articleIndicesView)

import Data.Blog.Article exposing (ArticleIndex, ArticleIndicies)
import Data.Blog.Tag exposing (Tag)
import Html exposing (Html, a, div, text)
import Route as Route
import Route.Blog as BlogRoute


tagView : Tag -> Html msg
tagView tag =
    let
        href =
            Route.href (Route.Blog (BlogRoute.TaggedArticles tag))
    in
    a [ href ] [ text tag.unTag ]


articleIndexView : ArticleIndex -> Html msg
articleIndexView articleIndex =
    let
        href =
            Route.href (Route.Blog (BlogRoute.Article articleIndex.year articleIndex.month articleIndex.day articleIndex.slug))
    in
    div []
        (a [ href ] [ text articleIndex.title ] :: List.map tagView articleIndex.tags)


articleIndicesView : ArticleIndicies -> Html msg
articleIndicesView articleIndices =
    div []
        (List.map articleIndexView articleIndices)
