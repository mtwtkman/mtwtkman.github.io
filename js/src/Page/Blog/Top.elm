module Page.Blog.Top exposing (Model, Msg, init, update, view)

import Browser.Navigation exposing (Key)
import Data.Blog.Article exposing (ArticleIndex, ArticleIndicies, articleIndicesDecoder)
import Html exposing (Html, a, div, text)
import Http
import Page exposing (Page)
import Resource.Blog exposing (articleIndexPath)
import Route as Route
import Route.Blog as BlogRoute


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


articleIndexView : ArticleIndex -> Html Msg
articleIndexView articleIndex =
    let
        href =
            Route.href (Route.Blog (BlogRoute.Article articleIndex.year articleIndex.month articleIndex.day articleIndex.slug))
    in
    div []
        [ a [ href ] [ text articleIndex.title ] ]


articleIndicesView : ArticleIndicies -> Html Msg
articleIndicesView articleIndices =
    div []
        (List.map articleIndexView articleIndices)
