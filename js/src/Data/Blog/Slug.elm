module Data.Blog.Slug exposing (Slug, slugDecoder)

import Json.Decode exposing (Decoder, field, string, map)

type alias Slug =
    { unSlug : String
    }

slugDecoder : Decoder Slug
slugDecoder =
  map Slug (field "slug" string )
