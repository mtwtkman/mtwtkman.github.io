module Page.Blog.Top exposing (Model, Msg, init, update, view)

import Browser.Navigation exposing (Key)
import Data.Blog.Entry exposing (EntryIndicies, entryIndicesDecoder)
import Html exposing (div, h1, text)
import Html.Attributes exposing (class)
import Http
import Page exposing (Page)
import Page.Blog.View exposing (entryIndicesView)
import Resource.Blog exposing (entryIndexPath)


navKey : Model -> Key
navKey model =
    case model of
        Fetching key ->
            key

        Fetched key _ ->
            key

        Failed key ->
            key


init : Key -> ( Model, Cmd Msg )
init key =
    ( Fetching key
    , Http.get
        { url = entryIndexPath
        , expect = Http.expectJson GotEntryIndices entryIndicesDecoder
        }
    )


type Model
    = Fetching Key
    | Fetched Key EntryIndicies
    | Failed Key


type Msg
    = GotEntryIndices (Result Http.Error EntryIndicies)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        key =
            navKey model
    in
    case msg of
        GotEntryIndices result ->
            case result of
                Ok entryIndices ->
                    ( Fetched key entryIndices, Cmd.none )

                Err _ ->
                    ( Failed key, Cmd.none )


view : Model -> Page Msg
view model =
    { title = "Entries"
    , content =
        case model of
            Fetching _ ->
                text "Fetching entries"

            Fetched _ entryIndices ->
                div [ class "blog-top" ]
                    [ h1 [] [ text "Entries" ]
                      , entryIndicesView entryIndices
                    ]

            Failed _ ->
                text "Failed fetching entries"
    }
