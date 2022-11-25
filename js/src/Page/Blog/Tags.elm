module Page.Blog.Tags exposing (Model, Msg, update, view, init)

import Browser.Navigation exposing (Key)
import Data.Blog.Tag exposing (Tag, tagDecoder)
import Html exposing (div, text)
import Http
import Json.Decode as D
import Page exposing (Page)


init : Key -> ( Model, Cmd Msg )
init key =
    ( Fetching key
    , Http.get
        { url = "./articles/tags.json"
        , expect = Http.expectJson FetchedTags (D.list tagDecoder)
        }
    )


type alias Tags =
    List Tag


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
    | Fetched Key Tags
    | Failed Key


type Msg
    = FetchedTags (Result Http.Error Tags)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        key =
            navKey model
    in
    case msg of
        FetchedTags result ->
            case result of
                Ok tags ->
                    ( Fetched key tags, Cmd.none )

                Err _ ->
                    ( Failed key, Cmd.none )


view : Model -> Page Msg
view model =
    { title = "tags"
    , content =
        div [] [ text "blog/tags" ]
    }
