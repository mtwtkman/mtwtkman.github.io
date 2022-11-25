module Page.Top exposing (view, init, Model, update, Msg)

import Html exposing (div, text, a)
import Page exposing (Page)
import Browser.Navigation exposing (Key)
import Route
import Route.Blog as BlogRoute

type alias Model =
  { key : Key
  }

type alias Msg = ()

init : Key -> ( Model, Cmd Msg)
init key = ( { key = key }, Cmd.none)

update : Model -> ( Model, Cmd Msg )
update model =
   ( model, Cmd.none )

view : Model -> Page Msg
view _ =
    { title = "top"
    , content = div [] [ a [Route.href (Route.Blog (BlogRoute.Top))] [ text "blog" ]]
    }
