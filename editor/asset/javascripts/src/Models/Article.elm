module Models exposing(Article

import Json.Decode exposing(int, string, bool)
import Json.Decode.Pipeline exposing(decode, required, hardcoded)
import Markdown


type alias Article a =
  { id : Int
  , title : String
  , slug : String
  , published : Bool
  , created_at : String
  , content: a
  }



-- SEREALIZATION


decoder : Decode (Article ())
decoder =
  baseArticleDecoder
    |> hardcoded ()


decoderWithContent : Decode (Article Content)
decoderWithContent =
  baseArticleDecoder
    |> required "content" contentDecoder


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


contentDecoder : Decoder Content
contentDecoder =
  Decoder.map Content Decoder.string
