module Data.Blog.Slug exposing (Slug, slugDecoder)

import Json.Decode exposing (Decoder, string, map)

type alias Slug =
    { unSlug : String
    }

slugDecoder : Decoder Slug
slugDecoder =
  map Slug string
