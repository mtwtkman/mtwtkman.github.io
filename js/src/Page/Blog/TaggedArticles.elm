module Page.Blog.TaggedArticles exposing (Model, Msg, init, update, view)

import Browser.Navigation exposing (Key)
import Data.Blog.Article exposing (ArticleIndicies, articleIndicesDecoder)
import Data.Blog.Tag exposing (Tag)
import Html exposing (text)
import Http
import Page exposing (Page)
import Page.Blog.View exposing (articleIndicesView)
import Resource.Blog as BlogResource


init : Key -> Tag -> ( Model, Cmd Msg )
init key tag =
    ( Fetching key
    , Http.get
        { url = BlogResource.buildTaggedPath tag
        , expect = Http.expectJson FetchedTaggedArticles articleIndicesDecoder
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
    | Fetched Key ArticleIndicies
    | Failed Key


type Msg
    = FetchedTaggedArticles (Result Http.Error ArticleIndicies)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        key =
            navKey model
    in
    case msg of
        FetchedTaggedArticles result ->
            case result of
                Ok articleTitles ->
                    ( Fetched key articleTitles, Cmd.none )

                Err _ ->
                    ( Failed key, Cmd.none )


view : Model -> Page Msg
view model =
    { title = "tagged"
    , content =
        case model of
            Fetching _ ->
                text "Fetched tagged articles"

            Fetched _ articleIndicies ->
                articleIndicesView articleIndicies

            Failed _ ->
                text "Failed fetching tagged articles"
    }
