module Page.Blog.Article exposing (Model, Msg, PathParam, init, update, view)

import Browser.Navigation exposing (Key)
import Data.Blog.Article exposing (Article, articleDecoder)
import Data.Blog.Slug exposing (Slug)
import Html exposing (div, text)
import Http
import Page exposing (Page)
import Resource.Blog exposing (buildArticlePath)


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
        { url = buildArticlePath pathParam.year pathParam.month pathParam.day pathParam.slug
        , expect = Http.expectJson FetchedArticle articleDecoder
        }
    )


type Model
    = Fetching Key
    | Fetched Key Article
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
    = FetchedArticle (Result Http.Error Article)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        FetchedArticle result ->
            case result of
                Ok article ->
                    ( Fetched (navKey model) article, Cmd.none )

                Err _ ->
                    ( Failed (navKey model), Cmd.none )


view : Model -> Page Msg
view model =
    { title = "article"
    , content = div [] [ text "blog/article" ]
    }
