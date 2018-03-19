module Data.Article
    exposing
        ( Article
        , Articles
        , ArticleWithBody
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


type alias ArticleBase a =
    { id : Int
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
        |> required "id" Decode.int
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
