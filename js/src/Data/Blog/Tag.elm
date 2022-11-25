module Data.Blog.Tag exposing (Tag, tagDecoder)

import Json.Decode exposing (Decoder, field, string, map)

type alias Tag =
    { unTag : String
    }

tagDecoder : Decoder Tag
tagDecoder =
  map Tag (field "tag" string )
