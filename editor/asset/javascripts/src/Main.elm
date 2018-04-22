module Main exposing (..)

import Html exposing (..)
import Http
import Navigation exposing (Location)
import View.Index exposing (indexView)
import Data.Article exposing (Articles)
import Request.Article


-- MAIN

main : Program Never Model Msg
main =
    Navigation.program UrlChange
        { init = init
        , view = view
        , update = update
        , subscriptions = (\_ -> Sub.none)
        }



-- MODEL


type alias Model =
    { articles : Articles
    }


init : Location -> ( Model, Cmd Msg )
init location =
    ( Model []
    , Http.send LoadArticles <| Request.Article.getAll
    )



-- UPDATE


type Msg
    = UrlChange Location
    | LoadArticles (Result Http.Error Articles)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UrlChange location ->
            ( model
            , Cmd.none
            )

        LoadArticles (Ok articles) ->
            ( Model articles
            , Cmd.none
            )

        LoadArticles (Err _) ->
            ( model
            , Cmd.none
            )



-- VIEW


view : Model -> Html msg
view model =
    div []
        [ h1 [] [ text "Articles" ]
        , indexView model.articles
        ]