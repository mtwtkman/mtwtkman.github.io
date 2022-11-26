module Data.Blog.Tag exposing (Tag, tagDecoder)

import Json.Decode exposing (Decoder, map, string)


type alias Tag =
    { unTag : String
    }


tagDecoder : Decoder Tag
tagDecoder =
    map Tag string
