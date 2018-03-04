import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as Decode


main =
  Html.program
  { init = init
  , update = update
  , view = view
  , subscriptions = subscriptions
  }



-- MODEL


type alias Article =
  { id : Int
  , title : String
  , slug : String
  , published : Bool
  , created_at : String
  }


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
    <| Http.get "http://localhost:3000/api/articles/" decodeArticles


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
    <| List.map (\l -> li [] [ text l.title ]) articles



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none
