module Data.Blog.Article exposing (Article, ArticleTitle, ArticleTitles, articleDecoder, articleTitlesDecoder)

import Data.Blog.Slug exposing (Slug, slugDecoder)
import Data.Blog.Tag exposing (Tag, tagDecoder)
import Iso8601
import Json.Decode exposing (Decoder, field, list, map2, map5, string)
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


type alias ArticleTitle =
    { title : String
    , path : String
    }


type alias ArticleTitles =
    List ArticleTitle


articleTitleDecoder : Decoder ArticleTitle
articleTitleDecoder =
    map2 ArticleTitle
        (field "title" string)
        (field "path" string)


articleTitlesDecoder : Decoder ArticleTitles
articleTitlesDecoder =
    list articleTitleDecoder
