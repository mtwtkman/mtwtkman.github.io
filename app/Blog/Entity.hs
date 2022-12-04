module Blog.Entity where

import qualified Data.Text as T
import Data.Time (UTCTime)

data Entry = Entry
  { unTitle :: T.Text,
    unBody :: T.Text,
    unSlug :: String,
    unTags :: [String],
    unCreatedAt :: UTCTime
  }
  deriving (Show, Eq)

newtype PublishedAt = PublishedAt UTCTime deriving (Show, Eq)

data EntryState = Draft Entry | Published Entry PublishedAt deriving (Show, Eq)
