module Route exposing (Route, matchers, parseLocation)

import Navigation exposing (Location)
import UrlParser as Url exposing (Parser, oneOf, paseHash, NotFoundRoute)


-- ROUTING


type Route
    = Root


route : Parser (Route -> a) a
route =
    oneOf
        [ Url.map Root (s "")
        ]


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



-- HELPERS


fromLocation : Location -> Maybe Route
fromLocation location =
    if String.isEmpty location.hash then
        Just Root
    else
        parseHash route location
