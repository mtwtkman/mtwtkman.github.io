module Route.Blog exposing (Route(..), parsers, routeToPieces)

import Data.Blog.Slug as Slug
import Data.Blog.Tag as Tag
import Url.Parser as Parser exposing ((</>), Parser, int, s, string)


type Route
    = Top
    | Article String String String Slug.Slug
    | Tags
    | TaggedArticles Tag.Tag


root : String
root =
    "blog"


rootParser : Parser a a
rootParser =
    s root


tagsRoot : String
tagsRoot =
    "tags"


parsers : List (Parser (Route -> a) a)
parsers =
    [ Parser.map Top rootParser
    , Parser.map Article (rootParser </> string </> string </> string </> Parser.custom "SLUG" (Slug.Slug >> Just))
    , Parser.map Tags (rootParser </> s "tags")
    , Parser.map TaggedArticles (rootParser </> s "tagged" </> Parser.custom "TAG" (Tag.Tag >> Just))
    ]


routeToPieces : Route -> List String
routeToPieces route =
    case route of
        Top ->
            [ root ]

        Article year month day slug ->
            [ root, year, month, day, slug.unSlug ]

        Tags ->
            [ root, tagsRoot ]

        TaggedArticles tag ->
            [ root, tagsRoot, tag.unTag ]
