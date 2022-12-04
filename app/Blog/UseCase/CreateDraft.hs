{-# LANGUAGE OverloadedStrings #-}

module Blog.UseCase.CreateDraft where

import qualified Blog.Datastore.Sqlite as Q
import Blog.Entity
import Data.Time
import Database.SQLite.Simple

data CreateDraftError = CreatedDraftFile deriving (Show, Eq)

data CreatedDraftEntry = CreatedDraftEntry String String String String UTCTime

instance FromRow CreatedDraftEntry where
  fromRow = CreatedDraftEntry <$> field <*> field <*> field <*> field <*> field

draft :: UTCTime -> String -> EntryState
draft createdAt slug = Draft $ Entry "" "" slug [] createdAt

createDraft :: Q.Db -> String -> IO CreatedDraftEntry
createDraft db slug = do
  dbConn <- Q.makeConnection db
  createdAt <- getCurrentTime
  let entry = draft createdAt slug
  [createdDraft] <- query_ dbConn "select * from entries"
  return createdDraft
