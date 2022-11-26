module Page exposing (Page)

import Html exposing (Html)


type alias Page msg =
    { title : String
    , content : Html msg
    }
