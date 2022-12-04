{-# LANGUAGE OverloadedStrings #-}

module Blog.UseCase.CreateDraft where

import qualified Blog.Datastore.Sqlite as Q
import Blog.Entity
import Data.Time
import Database.SQLite.Simple

data CreateDraftError = CreatedDraftFile deriving (Show, Eq)

draft :: UTCTime -> String -> EntryState
draft createdAt slug = Draft $ Entry "" "" slug [] createdAt

createDraft :: Q.Db -> String -> IO ()
createDraft db slug = do
  dbConn <- Q.makeConnection db
  execute dbConn "insert into entries (title, body, slug) values ('', '', ?)" (Only slug)
  close dbConn
