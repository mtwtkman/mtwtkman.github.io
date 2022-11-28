module Page.Top exposing (Model, Msg, init, update, view)

import Browser.Navigation exposing (Key)
import Html exposing (a, div, h1, text)
import Html.Attributes exposing (class)
import Page exposing (Page)
import Route
import Route.Blog as BlogRoute


type alias Model =
    { key : Key
    }


type alias Msg =
    ()


init : Key -> ( Model, Cmd Msg )
init key =
    ( { key = key }, Cmd.none )


update : Model -> ( Model, Cmd Msg )
update model =
    ( model, Cmd.none )


view : Model -> Page Msg
view _ =
    { title = "mtwtkman.github.io"
    , content =
        div
            [ class "top-wrapper" ]
            [ h1 [] [ text "mtwtkman" ]
            , a [ Route.href (Route.Blog BlogRoute.Top) ] [ text "blog" ]
            ]
    }
