module Page.Blog.Top exposing (Model, Msg, init, update, view)

import Browser.Navigation exposing (Key)
import Data.Blog.Article exposing (ArticleTitles, articleTitlesDecoder)
import Html exposing (div, text)
import Http
import Page exposing (Page)


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
    , Http.get { url = "./articles/titles.json", expect = Http.expectJson GotArticleTitles articleTitlesDecoder }
    )


type Model
    = Fetching Key
    | Fetched Key ArticleTitles
    | Failed Key


type Msg
    = GotArticleTitles (Result Http.Error ArticleTitles)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        key =
            navKey model
    in
    case msg of
        GotArticleTitles result ->
            case result of
                Ok articleTitles ->
                    ( Fetched key articleTitles, Cmd.none )

                Err _ ->
                    ( Failed key, Cmd.none )


view : Model -> Page Msg
view model =
    { title = "blog-articles"
    , content = div [] [ text "blog/articles" ]
    }
