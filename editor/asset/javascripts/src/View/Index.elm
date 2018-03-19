module View.Index exposing (..)

import Data.Article exposing (Article, Articles)
import Html exposing (..)
import Html.Attributes exposing (..)


indexView : Articles -> Html msg
indexView articles =
    div []
        [ ul [] (List.map titleView articles)
        ]


titleView : Article -> Html msg
titleView article =
    li [] [ a [ href ("#" ++ toString article.id) ] [ text article.title ] ]
