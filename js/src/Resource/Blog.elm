module Resource.Blog  exposing (buildArticlePath, articleIndexPath)

import Data.Blog.Slug exposing (Slug)
import Resource as R

buildResourcePath : List String -> String
buildResourcePath paths = R.buildResourcePath ("blog" :: paths )

articleIndexPath : String
articleIndexPath = buildResourcePath ["articles", "index.json"]

buildArticlePath : String -> String -> String -> Slug -> String
buildArticlePath year month day slug =
  buildResourcePath ["articles", year, month, day, slug.unSlug ++ ".json" ]
