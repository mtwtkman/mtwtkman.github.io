module Data.Blog.Entry exposing (Entry, EntryIndex, EntryIndicies, entryDecoder, entryIndicesDecoder)

import Data.Blog.Slug exposing (Slug, slugDecoder)
import Data.Blog.Tag exposing (Tag, tagDecoder)
import Iso8601
import Json.Decode exposing (Decoder, field, list, map5, map6, string)
import Time exposing (Posix)


type alias Entry =
    { title : String
    , body : String
    , slug : Slug
    , tags : List Tag
    , publishedAt : Posix
    }


entryDecoder : Decoder Entry
entryDecoder =
    map5 Entry
        (field "title" string)
        (field "body" string)
        (field "slug" slugDecoder)
        (field "tags" (list tagDecoder))
        (field "publishedAt" Iso8601.decoder)


type alias EntryIndex =
    { title : String
    , tags : List Tag
    , year : String
    , month : String
    , day : String
    , slug : Slug
    }


type alias EntryIndicies =
    List EntryIndex


entryIndexDecoder : Decoder EntryIndex
entryIndexDecoder =
    map6 EntryIndex
        (field "title" string)
        (field "tags" (list tagDecoder))
        (field "year" string)
        (field "month" string)
        (field "day" string)
        (field "slug" slugDecoder)


entryIndicesDecoder : Decoder EntryIndicies
entryIndicesDecoder =
    list entryIndexDecoder
