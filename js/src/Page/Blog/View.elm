module Page.Blog.View exposing (entryIndicesView, tagView)

import Data.Blog.Entry exposing (EntryIndex, EntryIndicies)
import Data.Blog.Tag exposing (Tag)
import Html exposing (Html, a, div, span, text)
import Html.Attributes exposing (class)
import Route as Route
import Route.Blog as BlogRoute
import View exposing (iconView)


tagView : Tag -> Html msg
tagView tag =
    let
        href =
            Route.href (Route.Blog (BlogRoute.TaggedEntries tag))
    in
    a
        [ href
        , class "tagname"
        ]
        [ iconView "sell"
        , text tag.unTag
        ]


tagsView : List Tag -> Html msg
tagsView tags =
    div
        [ class ".tagnames-wrapper" ]
        (List.map tagView tags)


entryIndexView : EntryIndex -> Html msg
entryIndexView entryIndex =
    let
        href =
            Route.href (Route.Blog (BlogRoute.Entry entryIndex.year entryIndex.month entryIndex.day entryIndex.slug))
    in
    div
        [ class "entry-title" ]
        [ a [ href, class "entry-title-link" ] [ text entryIndex.title ]
        , span [class "entry-published-date" ] [ text ("(" ++ String.join "/" [ entryIndex.year, entryIndex.month, entryIndex.day ] ++ ")") ]
        , tagsView entryIndex.tags
        ]


entryIndicesView : EntryIndicies -> Html msg
entryIndicesView entryIndices =
    div [ class "entries-wrapper" ]
        (List.map entryIndexView entryIndices)
