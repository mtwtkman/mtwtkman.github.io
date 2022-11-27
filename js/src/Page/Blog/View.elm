module Page.Blog.View exposing (entryIndicesView, tagView)

import Data.Blog.Entry exposing (EntryIndex, EntryIndicies)
import Data.Blog.Tag exposing (Tag)
import Html exposing (Html, a, div, text)
import Route as Route
import Route.Blog as BlogRoute


tagView : Tag -> Html msg
tagView tag =
    let
        href =
            Route.href (Route.Blog (BlogRoute.TaggedEntries tag))
    in
    a [ href ] [ text (tag.unTag) ]


entryIndexView : EntryIndex -> Html msg
entryIndexView entryIndex =
    let
        href =
            Route.href (Route.Blog (BlogRoute.Entry entryIndex.year entryIndex.month entryIndex.day entryIndex.slug))
    in
    div []
        (a [ href ] [ text entryIndex.title ] :: List.map tagView entryIndex.tags)


entryIndicesView : EntryIndicies -> Html msg
entryIndicesView entryIndices =
    div []
        (List.map entryIndexView entryIndices)
