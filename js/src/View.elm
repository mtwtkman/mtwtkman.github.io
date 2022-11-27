module View exposing (iconView)

import Html.Attributes exposing (class)
import Html exposing (Html, i, text)

iconView : String -> Html msg
iconView name =
  i [ class "material-icons" ] [ text name]
