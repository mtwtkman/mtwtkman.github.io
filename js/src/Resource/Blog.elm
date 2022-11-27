module Resource.Blog exposing (entryIndexPath, buildEntryPath, buildTaggedPath)

import Data.Blog.Slug exposing (Slug)
import Data.Blog.Tag exposing (Tag)
import Resource as R


buildResourcePath : List String -> String
buildResourcePath paths =
    R.buildResourcePath ("blog" :: paths)


entryIndexPath : String
entryIndexPath =
    buildResourcePath [ "meta", "index.json" ]


buildEntryPath : String -> String -> String -> Slug -> String
buildEntryPath year month day slug =
    buildResourcePath [ "entries", year, month, day, slug.unSlug ++ ".json" ]


buildTaggedPath : Tag -> String
buildTaggedPath tag =
    buildResourcePath [ "meta", "tagged", tag.unTag ++ ".json" ]
