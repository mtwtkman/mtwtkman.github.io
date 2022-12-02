{-# LANGUAGE OverloadedStrings #-}

module Blog.Entity where

import qualified Data.Text as T
import Data.Time (UTCTime)

data Entity = Entity
  { unTitle :: T.Text,
    unBody :: T.Text,
    unSlug :: String,
    unTags :: [String],
    unCreatedAt :: UTCTime
  }

newtype PublishedAt = PublishedAt UTCTime

data EntityState = Draft Entity | Published Entity PublishedAt

draft :: UTCTime -> String -> EntityState
draft createdAt slug = Draft $ Entity "" "" slug [] createdAt

data PublishError = AlreadyPublished

publish :: EntityState -> PublishedAt -> Either PublishError EntityState
publish (Draft entity) publishedAt = Right (Published entity publishedAt)
publish _ _ = Left AlreadyPublished

