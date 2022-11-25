module Main exposing (main)

import Browser exposing (Document, UrlRequest)
import Browser.Navigation as Nav exposing (Key)
import Html exposing (Html, div, text)
import Page.Blog as BlogPage
import Page.Top as TopPage
import Route exposing (Route)
import Url exposing (Url)


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlChange = ChangedUrl
        , onUrlRequest = ClickedLink
        }


type Model
    = Redirect Key
    | NotFound Key
    | Top Key TopPage.Model
    | Blog Key BlogPage.Model


type Msg
    = ChangedUrl Url
    | ClickedLink UrlRequest
    | GotTopMsg TopPage.Msg
    | GotBlogMsg BlogPage.Msg


navKey : Model -> Key
navKey model =
    case model of
        Redirect key ->
            key

        NotFound key ->
            key

        Top key _ ->
            key

        Blog key _ ->
            key


init : () -> Url -> Key -> ( Model, Cmd Msg )
init () url key =
    changeRouteTo (Route.fromUrl url)
        (Redirect key)


updateWith : (subMsg -> Msg) -> (subModel -> Model) -> ( subModel, Cmd subMsg ) -> ( Model, Cmd Msg )
updateWith toMsg toModel ( subModel, subCmd ) =
    ( toModel subModel, Cmd.map toMsg subCmd )


changeRouteTo : Maybe Route -> Model -> ( Model, Cmd Msg )
changeRouteTo maybeRoute model =
    let
        key =
            navKey model
    in
    case maybeRoute of
        Nothing ->
            ( NotFound key , Cmd.none )

        Just Route.Top ->
            TopPage.init key
                |> updateWith GotTopMsg (Top key)

        Just (Route.Blog subRoute) ->
            BlogPage.init subRoute key
                |> updateWith GotBlogMsg (Blog key)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model ) of
        ( ClickedLink urlRequest, _ ) ->
            case urlRequest of
                Browser.Internal url ->
                    case url.fragment of
                        Nothing ->
                            ( model, Cmd.none )

                        Just _ ->
                            ( model
                            , Nav.pushUrl (navKey model)  (Url.toString url)
                            )

                Browser.External href ->
                    ( model
                    , Nav.load href
                    )

        ( ChangedUrl url, _ ) ->
            changeRouteTo (Route.fromUrl url) model

        ( GotTopMsg _, Top key subModel ) ->
            TopPage.update subModel |> updateWith GotTopMsg (Top key)

        ( GotBlogMsg subMsg, Blog key subModel ) ->
            BlogPage.update subMsg subModel |> updateWith GotBlogMsg (Blog key)
        (_, _) ->
          ( model, Cmd.none )


view : Model -> Document Msg
view model =
    case model of
        Redirect _ ->
            { title = "redirect", body = [] }

        Top _ subModel ->
            let
                subView =
                    TopPage.view subModel
            in
            { title = subView.title, body = [ Html.map GotTopMsg subView.content ] }

        Blog _ subModel ->
            let
                subView =
                    BlogPage.view subModel
            in
            { title = subView.title, body = [ Html.map GotBlogMsg subView.content ] }

        NotFound _ ->
            { title = "not found", body = [ div [] [ text "page not found" ] ] }


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none
