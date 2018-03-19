module Request.Article exposing (..)

import Data.Article exposing (Articles, decoderArticles)
import Constant exposing (apiBaseUrl)
import Http


-- GET ALL ARTICLES


getAll : Http.Request Articles
getAll =
    Http.get (apiBaseUrl ++ "articles") decoderArticles
