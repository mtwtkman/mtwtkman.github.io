import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Models.Article exposing(Article)
import Constant exposing (apiBaseUrl)


main =
  Html.program
  { init = init
  , update = update
  , view = view
  , subscriptions = subscriptions
  }



-- MODEL
type alias Model =
  List Article


model : Model
model =
  []


init : (Model, Cmd Msg)
init =
  ( []
  , getArticles
  )



-- UPDATE


type Msg
  = GetArticles (Result Http.Error Model)


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    GetArticles(Ok articles) ->
      (articles, Cmd.none)

    GetArticles(Err _) ->
      (model, Cmd.none)



-- HTTP
getArticles : Cmd Msg
getArticles =
  Http.send GetArticles
    <| Http.get (apiBaseURL ++ "articles/") decodeArticles


decodeArticle : Decode.Decoder Article
decodeArticle =
  Decode.map5 Article
    (Decode.field "id" Decode.int)
    (Decode.field "title" Decode.string)
    (Decode.field "slug" Decode.string)
    (Decode.field "published" Decode.bool)
    (Decode.field "created_at" Decode.string)


decodeArticles : Decode.Decoder Model
decodeArticles =
  Decode.list decodeArticle



-- VIEW


view : Model -> Html Msg
view model =
  div []
    [ h2 [] [ text "記事一覧" ]
    , toList model
    ]


toList : Model -> Html Msg
toList articles =
  ul []
    <| List.map articleLink articles


articleLink : Article -> Html Msg
articleLink article =
  li []
    [ a [ href (baseURL ++ "/article/" ++ (toString article.id)) ]
      [ text article.title ]
    ]



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none
