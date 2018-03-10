module Models exposing(Article

import Html exposing (Html, Attribute)
import Json.Decode exposing(int, string, bool)
import Json.Decode.Pipeline exposing(decode, required, hardcoded)
import Markdown


type alias Article a =
  { id : Int
  , title : String
  , slug : String
  , published : Bool
  , created_at : String
  , body: a
  }



-- SEREALIZATION


decoder : Decode (Article ())
decoder =
  baseArticleDecoder
    |> hardcoded ()


decoderWithContent : Decode (Article Content)
decoderWithContent =
  baseArticleDecoder
    |> required "body" bodyDecoder


baseArticleDecoder : Decode (a -> Article a)
baseArticleDecoder =
  decode Article
    |> required "id" int
    |> required "title" string
    |> required "slug" string
    |> required "published" bool
    |> required "created_at" string



-- CONTENT


type Content
  = Content Markdown


type alias Markdown
  = String


bodyToHtml : Content -> List (Attribute msg) -> Html msg
bodyToHtml (Content markdown) attributes =
  Markdown.toHtml attributes markdown


bodyToMarkdownString : Content -> String
bodyToMarkdownString (Content markdown) =
  markdown


bodyDecoder : Decoder Content
bodyDecoder =
  Decoder.map Content Decoder.string
