module Main where

import qualified Data.Text as T
import Data.Time (UTCTime)

newtype NewOptions = NewOptions String

data Command
  = New NewOptions
  | Build

newtype Slug = Slug String

newtype Tag = Tag String

data Entry = Entry
  { unTitle :: T.Text,
    unBody :: T.Text,
    unSlug :: Slug,
    unTags :: [Tag],
    unPublishedAt :: UTCTime
  }

main :: IO ()
main = print ""
