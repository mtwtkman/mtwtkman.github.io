module Page.Blog.Top exposing (Model, Msg, init, update, view)

import Browser.Navigation exposing (Key)
import Data.Blog.Article exposing (ArticleIndicies, articleIndicesDecoder)
import Html exposing (text)
import Http
import Page exposing (Page)
import Page.Blog.View exposing (articleIndicesView)
import Resource.Blog exposing (articleIndexPath)


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
        { url = articleIndexPath
        , expect = Http.expectJson GotArticleIndices articleIndicesDecoder
        }
    )


type Model
    = Fetching Key
    | Fetched Key ArticleIndicies
    | Failed Key


type Msg
    = GotArticleIndices (Result Http.Error ArticleIndicies)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        key =
            navKey model
    in
    case msg of
        GotArticleIndices result ->
            case result of
                Ok articleIndices ->
                    ( Fetched key articleIndices, Cmd.none )

                Err _ ->
                    ( Failed key, Cmd.none )


view : Model -> Page Msg
view model =
    { title = "Articles"
    , content =
        case model of
            Fetching _ ->
                text "Fetching articles"

            Fetched _ articleIndices ->
                articleIndicesView articleIndices

            Failed _ ->
                text "Failed fetching articles"
    }
