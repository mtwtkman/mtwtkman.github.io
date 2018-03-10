module Routing exposing (..)

import Navigation exposing (Location)
import UrlParser exposing (..)



type Route
  = IndexRoute



matchers : Parser (Route -> a) a
machers =
  oneOf
    [ map IndexRoute top
    ]


parseLocation : Location -> Route
parseLocation location =
  case (parseHash matchers location) of
    Just route ->
      route

    Nothing ->
      NotFoundRoute
