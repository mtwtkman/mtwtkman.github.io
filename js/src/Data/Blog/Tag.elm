module Data.Blog.Tag exposing (Tag, tagDecoder)

import Json.Decode exposing (Decoder, string, map)

type alias Tag =
    { unTag : String
    }

tagDecoder : Decoder Tag
tagDecoder =
  map Tag string
