module Route.Blog exposing (Route(..), parsers, routeToPieces)

import Data.Blog.Slug as Slug
import Data.Blog.Tag as Tag
import Url.Parser as Parser exposing ((</>), Parser, s, string)


type Route
    = Top
    | Entry String String String Slug.Slug
    | Tags
    | TaggedEntries Tag.Tag


root : String
root =
    "blog"


rootParser : Parser a a
rootParser =
    s root


parsers : List (Parser (Route -> a) a)
parsers =
    [ Parser.map Top rootParser
    , Parser.map Entry (rootParser </> string </> string </> string </> Parser.custom "SLUG" (Slug.Slug >> Just))
    , Parser.map Tags (rootParser </> s "tags")
    , Parser.map TaggedEntries (rootParser </> s "tagged" </> Parser.custom "TAG" (Tag.Tag >> Just))
    ]


routeToPieces : Route -> List String
routeToPieces route =
    case route of
        Top ->
            [ root ]

        Entry year month day slug ->
            [ root, year, month, day, slug.unSlug ]

        Tags ->
            [ root, "tags" ]

        TaggedEntries tag ->
            [ root, "tagged", tag.unTag ]
