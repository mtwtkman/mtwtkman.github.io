module Page.Blog exposing (Model, Msg, init, update, view)

import Browser.Navigation exposing (Key)
import Html exposing (Html, text)
import Page exposing (Page)
import Page.Blog.Article as ArticlePage
import Page.Blog.TaggedArticles as TaggedArticlesPage
import Page.Blog.Tags as TagsPage
import Page.Blog.Top as TopPage
import Route.Blog as Route


init : Route.Route -> Key -> ( Model, Cmd Msg )
init route key =
    case route of
        Route.Top ->
            let
                ( subModel, subCmd ) =
                    TopPage.init key
            in
            ( Top subModel, Cmd.map GotTopMsg subCmd )

        Route.Article year month day slug ->
            let
                ( subModel, subCmd ) =
                    ArticlePage.init key (ArticlePage.PathParam year month day slug)
            in
            ( Article subModel, Cmd.map GotArticleMsg subCmd )

        Route.TaggedArticles tag ->
            let
                ( subModel, subCmd ) =
                    TaggedArticlesPage.init key tag
            in
            ( TaggedArticles subModel, Cmd.map GotTaggedArticlesMsg subCmd )

        Route.Tags ->
            let
                ( subModel, subCmd ) =
                    TagsPage.init key
            in
            ( Tags subModel, Cmd.map GotTagsMsg subCmd )


type Model
    = Top TopPage.Model
    | Article ArticlePage.Model
    | TaggedArticles TaggedArticlesPage.Model
    | Tags TagsPage.Model
    | Unknown


type Msg
    = GotTopMsg TopPage.Msg
    | GotArticleMsg ArticlePage.Msg
    | GotTaggedArticlesMsg TaggedArticlesPage.Msg
    | GotTagsMsg TagsPage.Msg


updateWith : (subMsg -> Msg) -> (subModel -> Model) -> ( subModel, Cmd subMsg ) -> ( Model, Cmd Msg )
updateWith toMsg toModel ( subModel, subCmd ) =
    ( toModel subModel, Cmd.map toMsg subCmd )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model ) of
        ( GotTopMsg subMsg, Top subModel ) ->
            TopPage.update subMsg subModel |> updateWith GotTopMsg Top

        ( GotArticleMsg subMsg, Article subModel ) ->
            ArticlePage.update subMsg subModel |> updateWith GotArticleMsg Article

        ( GotTaggedArticlesMsg subMsg, TaggedArticles subModel ) ->
            TaggedArticlesPage.update subMsg subModel |> updateWith GotTaggedArticlesMsg TaggedArticles

        ( GotTagsMsg subMsg, Tags subModel ) ->
            TagsPage.update subMsg subModel |> updateWith GotTagsMsg Tags

        ( _, _ ) ->
            ( Unknown, Cmd.none )


viewWith : (subModel -> Page subMsg) -> (subMsg -> Msg) -> subModel -> Page Msg
viewWith toView toMsg subModel =
    let
        subView =
            toView subModel
    in
    { title = subView.title, content = Html.map toMsg subView.content }


view : Model -> Page Msg
view model =
    case model of
        Top subModel ->
            viewWith TopPage.view GotTopMsg subModel

        Article subModel ->
            viewWith ArticlePage.view GotArticleMsg subModel

        TaggedArticles subModel ->
            viewWith TaggedArticlesPage.view GotTaggedArticlesMsg subModel

        Tags subModel ->
            viewWith TagsPage.view GotTagsMsg subModel

        Unknown ->
            { title = "unknown", content = text "uknown" }
