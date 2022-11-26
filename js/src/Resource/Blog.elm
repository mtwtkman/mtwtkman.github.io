module Resource.Blog exposing (articleIndexPath, buildArticlePath, buildTaggedPath)

import Data.Blog.Slug exposing (Slug)
import Data.Blog.Tag exposing (Tag)
import Resource as R


buildResourcePath : List String -> String
buildResourcePath paths =
    R.buildResourcePath ("blog" :: paths)


articleIndexPath : String
articleIndexPath =
    buildResourcePath [ "articles", "index.json" ]


buildArticlePath : String -> String -> String -> Slug -> String
buildArticlePath year month day slug =
    buildResourcePath [ "articles", year, month, day, slug.unSlug ++ ".json" ]


buildTaggedPath : Tag -> String
buildTaggedPath tag =
    buildResourcePath [ "articles", "tagged", tag.unTag ++ ".json" ]
