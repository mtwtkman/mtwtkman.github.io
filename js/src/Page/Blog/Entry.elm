module Page.Blog.Entry exposing (Model, Msg, PathParam, init, update, view)

import Browser.Navigation exposing (Key)
import Data.Blog.Entry exposing (Entry, entryDecoder)
import Data.Blog.Slug exposing (Slug)
import Html exposing (Html, div, h1, text)
import Html.Attributes exposing (class)
import Html.Parser as Parser
import Html.Parser.Util exposing (toVirtualDom)
import Http
import Iso8601 exposing (fromTime)
import Page exposing (Page)
import Page.Blog.View exposing (tagsView)
import Resource.Blog exposing (buildEntryPath)
import View exposing (iconView)


type alias PathParam =
    { year : String
    , month : String
    , day : String
    , slug : Slug
    }


init : Key -> PathParam -> ( Model, Cmd Msg )
init key pathParam =
    ( Fetching key
    , Http.get
        { url = buildEntryPath pathParam.year pathParam.month pathParam.day pathParam.slug
        , expect = Http.expectJson FetchedEntry entryDecoder
        }
    )


type Model
    = Fetching Key
    | Fetched Key Entry
    | Failed Key


navKey : Model -> Key
navKey model =
    case model of
        Fetching key ->
            key

        Fetched key _ ->
            key

        Failed key ->
            key


type Msg
    = FetchedEntry (Result Http.Error Entry)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        FetchedEntry result ->
            case result of
                Ok entry ->
                    ( Fetched (navKey model) entry, Cmd.none )

                Err _ ->
                    ( Failed (navKey model), Cmd.none )


view : Model -> Page Msg
view model =
    let
        title =
            case model of
                Fetching _ ->
                    "fetching"

                Fetched _ entry ->
                    entry.title

                Failed _ ->
                    "not found"
    in
    { title = "blog - " ++ title
    , content =
        case model of
            Fetching _ ->
                text "fetching entry"

            Fetched _ entry ->
                entryView entry

            Failed _ ->
                text "Failed fetching entry"
    }


entryView : Entry -> Html Msg
entryView entry =
    div
        [ class "entry-wrapper" ]
        [ h1 [ class "entry-title-header" ] [ text entry.title ]
        , div
            [ class "entry-published-at" ]
            [ iconView "calendar_month"
            , text (fromTime entry.publishedAt)
            ]
        , tagsView entry.tags
        , div [ class "entry-body" ]
            (case Parser.run entry.body of
                Ok nodes ->
                    toVirtualDom nodes

                Err _ ->
                    []
            )
        ]
