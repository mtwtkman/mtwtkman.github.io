module Route exposing (Route(..), fromUrl, href, replaceUrl)

import Browser.Navigation as Nav
import Html exposing (Attribute)
import Html.Attributes as Attr
import Route.Blog as BlogRoute
import Url exposing (Url)
import Url.Parser as Parser exposing ((</>), Parser, oneOf)


type Route
    = Top
    | Blog BlogRoute.Route


parser : Parser (Route -> a) a
parser =
    oneOf
        (Parser.map Top Parser.top :: List.map (Parser.map Blog) BlogRoute.parsers)


href : Route -> Attribute msg
href targetRoute =
    Attr.href (routeToString targetRoute)


replaceUrl : Nav.Key -> Route -> Cmd msg
replaceUrl key route =
    Nav.replaceUrl key (routeToString route)


fromUrl : Url -> Maybe Route
fromUrl url =
    { url | path = Maybe.withDefault "" url.fragment, fragment = Nothing }
        |> Parser.parse parser


routeToString : Route -> String
routeToString route =
    "#/" ++ String.join "/" (routeToPieces route)


routeToPieces : Route -> List String
routeToPieces route =
    case route of
        Top ->
            []

        Blog blogRoute ->
            BlogRoute.routeToPieces blogRoute
