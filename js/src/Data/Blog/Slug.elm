module Data.Blog.Slug exposing (Slug, slugDecoder)

import Json.Decode exposing (Decoder, map, string)


type alias Slug =
    { unSlug : String
    }


slugDecoder : Decoder Slug
slugDecoder =
    map Slug string
