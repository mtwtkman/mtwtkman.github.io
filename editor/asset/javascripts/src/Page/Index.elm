module Page.Index exposing (..)

import Data.Article exposing (Article, Articles, articleIdToString)
import Html exposing (..)
import Route 


indexView : Articles -> Html msg
indexView articles =
    div []
        [ ul [] (List.map titleView articles)
        ]


titleView : Article -> Html msg
titleView article =
    li [] [ a [ Route.href(Route.Article article.id) ] [ text article.title ] ]