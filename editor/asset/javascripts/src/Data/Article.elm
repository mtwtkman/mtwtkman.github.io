module Data.Article
    exposing
        ( Article
        , Articles
        , ArticleId
        , articleIdParser
        , ArticleWithBody
        , articleIdToString
        , Body
        , decoder
        , decoderArticles
        , decoderWithBody
        , bodyToHtml
        , bodyToMarkdownString
        , bodyDecoder
        )

import Html exposing (Html, Attribute)
import Json.Decode as Decode exposing (Decoder, list)
import Json.Decode.Pipeline exposing (decode, required, hardcoded)
import Markdown
import UrlParser


-- IDENTIFIERS


type ArticleId
    = ArticleId Int


articleIdParser : UrlParser.Parser (ArticleId -> a) a
articleIdParser =
    UrlParser.custom "ARTICLE_ID" stringToArticleId


articleIdToString : ArticleId -> String
articleIdToString (ArticleId id) =
    toString id


stringToArticleId : String -> Result.Result String ArticleId
stringToArticleId id =
    Result.map ArticleId (String.toInt id)


type alias ArticleBase a =
    { id : ArticleId
    , title : String
    , slug : String
    , published : Bool
    , created_at : String
    , body : a
    }


type alias Article =
    ArticleBase ()


type alias Articles =
    List Article


type alias ArticleWithBody =
    ArticleBase Body



-- SEREALIZATION


decoder : Decoder Article
decoder =
    baseArticleDecoder
        |> hardcoded ()


decoderArticles : Decode.Decoder Articles
decoderArticles =
    list decoder


decoderWithBody : Decoder ArticleWithBody
decoderWithBody =
    baseArticleDecoder
        |> required "body" bodyDecoder


baseArticleDecoder : Decoder (a -> ArticleBase a)
baseArticleDecoder =
    decode ArticleBase
        |> required "id" (Decode.map ArticleId Decode.int)
        |> required "title" Decode.string
        |> required "slug" Decode.string
        |> required "published" Decode.bool
        |> required "created_at" Decode.string



-- BODY


type Body
    = Body Markdown


type alias Markdown =
    String


bodyToHtml : Body -> List (Attribute msg) -> Html msg
bodyToHtml (Body markdown) attributes =
    Markdown.toHtml attributes markdown


bodyToMarkdownString : Body -> String
bodyToMarkdownString (Body markdown) =
    markdown


bodyDecoder : Decoder Body
bodyDecoder =
    Decode.map Body Decode.string
