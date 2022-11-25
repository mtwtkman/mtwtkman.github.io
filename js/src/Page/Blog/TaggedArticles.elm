module Page.Blog.TaggedArticles exposing (Model, Msg, init, update, view)

import Browser.Navigation exposing (Key)
import Data.Blog.Article exposing (ArticleTitles, articleTitlesDecoder)
import Data.Blog.Tag exposing (Tag)
import Html exposing (div, text)
import Http
import Page exposing (Page)


toAssetPath : Tag -> String
toAssetPath tag =
    String.join "/" [ ".", "tags", tag.unTag ]


init : Key -> Tag -> ( Model, Cmd Msg )
init key tag =
    ( Fetching key
    , Http.get
        { url = toAssetPath tag
        , expect = Http.expectJson FetchedTaggedArticles articleTitlesDecoder
        }
    )


navKey : Model -> Key
navKey model =
    case model of
        Fetching key ->
            key

        Fetched key _ ->
            key

        Failed key ->
            key


type Model
    = Fetching Key
    | Fetched Key ArticleTitles
    | Failed Key


type Msg
    = FetchedTaggedArticles (Result Http.Error ArticleTitles)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        key =
            navKey model
    in
    case msg of
        FetchedTaggedArticles result ->
            case result of
                Ok articleTitles ->
                    ( Fetched key articleTitles, Cmd.none )

                Err _ ->
                    ( Failed key, Cmd.none )


view : Model -> Page Msg
view model =
    { title = "tagged"
    , content =
        div [] [ text "blog/tagged-articles" ]
    }
