module Page.Blog.TaggedEntries exposing (Model, Msg, init, update, view)

import Browser.Navigation exposing (Key)
import Data.Blog.Entry exposing (EntryIndicies, entryIndicesDecoder)
import Data.Blog.Tag exposing (Tag)
import Html exposing (text)
import Http
import Page exposing (Page)
import Page.Blog.View exposing (entryIndicesView)
import Resource.Blog as BlogResource


init : Key -> Tag -> ( Model, Cmd Msg )
init key tag =
    ( Fetching key
    , Http.get
        { url = BlogResource.buildTaggedPath tag
        , expect = Http.expectJson FetchedTaggedEntries entryIndicesDecoder
        }
    )


navKey : Model -> Key
navKey model =
    case model of
        Fetching key ->
            key

        Fetched key _ ->
            key

        Failed key ->
            key


type Model
    = Fetching Key
    | Fetched Key EntryIndicies
    | Failed Key


type Msg
    = FetchedTaggedEntries (Result Http.Error EntryIndicies)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        key =
            navKey model
    in
    case msg of
        FetchedTaggedEntries result ->
            case result of
                Ok entryTitles ->
                    ( Fetched key entryTitles, Cmd.none )

                Err _ ->
                    ( Failed key, Cmd.none )


view : Model -> Page Msg
view model =
    { title = "tagged"
    , content =
        case model of
            Fetching _ ->
                text "Fetched tagged entries"

            Fetched _ entryIndicies ->
                entryIndicesView entryIndicies

            Failed _ ->
                text "Failed fetching tagged entries"
    }
