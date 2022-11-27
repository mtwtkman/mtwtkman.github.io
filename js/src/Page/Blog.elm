module Page.Blog exposing (Model, Msg, init, update, view)

import Browser.Navigation exposing (Key)
import Html exposing (text)
import Page exposing (Page)
import Page.Blog.Entry as EntryPage
import Page.Blog.TaggedEntries as TaggedEntriesPage
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

        Route.Entry year month day slug ->
            let
                ( subModel, subCmd ) =
                    EntryPage.init key (EntryPage.PathParam year month day slug)
            in
            ( Entry subModel, Cmd.map GotEntryMsg subCmd )

        Route.TaggedEntries tag ->
            let
                ( subModel, subCmd ) =
                    TaggedEntriesPage.init key tag
            in
            ( TaggedEntries subModel, Cmd.map GotTaggedEntriesMsg subCmd )

        Route.Tags ->
            let
                ( subModel, subCmd ) =
                    TagsPage.init key
            in
            ( Tags subModel, Cmd.map GotTagsMsg subCmd )


type Model
    = Top TopPage.Model
    | Entry EntryPage.Model
    | TaggedEntries TaggedEntriesPage.Model
    | Tags TagsPage.Model
    | Unknown


type Msg
    = GotTopMsg TopPage.Msg
    | GotEntryMsg EntryPage.Msg
    | GotTaggedEntriesMsg TaggedEntriesPage.Msg
    | GotTagsMsg TagsPage.Msg


updateWith : (subMsg -> Msg) -> (subModel -> Model) -> ( subModel, Cmd subMsg ) -> ( Model, Cmd Msg )
updateWith toMsg toModel ( subModel, subCmd ) =
    ( toModel subModel, Cmd.map toMsg subCmd )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model ) of
        ( GotTopMsg subMsg, Top subModel ) ->
            TopPage.update subMsg subModel |> updateWith GotTopMsg Top

        ( GotEntryMsg subMsg, Entry subModel ) ->
            EntryPage.update subMsg subModel |> updateWith GotEntryMsg Entry

        ( GotTaggedEntriesMsg subMsg, TaggedEntries subModel ) ->
            TaggedEntriesPage.update subMsg subModel |> updateWith GotTaggedEntriesMsg TaggedEntries

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

        Entry subModel ->
            viewWith EntryPage.view GotEntryMsg subModel

        TaggedEntries subModel ->
            viewWith TaggedEntriesPage.view GotTaggedEntriesMsg subModel

        Tags subModel ->
            viewWith TagsPage.view GotTagsMsg subModel

        Unknown ->
            { title = "unknown", content = text "uknown" }
