module Route exposing (Route(..), href)

import Navigation exposing (Location)
import UrlParser exposing (..)
import Html exposing (Attribute)
import Html.Attributes as Attr
import Data.Article exposing (ArticleId, articleIdToString, articleIdParser)


-- ROUTING


type Route
    = Root
    | Article ArticleId


route : Parser (Route -> a) a
route =
    oneOf
        [ map Root (s "")
        , map Article (s "article" </> articleIdParser)
        ]



-- HELPERS  

routeToString : Route -> String
routeToString page =
    let 
        pieces =
            case page of
                Root ->
                    []
                Article articleId ->
                    ["article", articleIdToString articleId]
    in
    "#/" ++ String.join "/" pieces


href : Route -> Attribute msg
href route =
    Attr.href (routeToString route)


fromLocation : Location -> Maybe Route
fromLocation location =
    if String.isEmpty location.hash then
        Just Root
    else
        parseHash route location