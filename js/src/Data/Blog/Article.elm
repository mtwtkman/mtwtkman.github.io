module Data.Blog.Article exposing (Article, ArticleIndex, ArticleIndicies, articleDecoder, articleIndicesDecoder)

import Data.Blog.Slug exposing (Slug, slugDecoder)
import Data.Blog.Tag exposing (Tag, tagDecoder)
import Iso8601
import Json.Decode exposing (Decoder, field, list, map6, map5, string)
import Time exposing (Posix)


type alias Article =
    { title : String
    , body : String
    , slug : Slug
    , tags : List Tag
    , publishedAt : Posix
    }


articleDecoder : Decoder Article
articleDecoder =
    map5 Article
        (field "title" string)
        (field "body" string)
        (field "slug" slugDecoder)
        (field "tags" (list tagDecoder))
        (field "publishedAt" Iso8601.decoder)


type alias ArticleIndex =
    { title : String
    , tags : List Tag
    , year : String
    , month: String
    , day: String
    , slug : Slug
    }


type alias ArticleIndicies =
    List ArticleIndex


articleIndexDecoder : Decoder ArticleIndex
articleIndexDecoder =
    map6 ArticleIndex
        (field "title" string)
        (field "tags" (list tagDecoder))
        (field "year" string)
        (field "month" string)
        (field "day" string)
        (field "slug" slugDecoder)

articleIndicesDecoder : Decoder ArticleIndicies
articleIndicesDecoder =
    list articleIndexDecoder
