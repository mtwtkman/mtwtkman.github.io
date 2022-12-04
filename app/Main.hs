module Main where

import Blog.Datastore.Sqlite
import Blog.UseCase.CreateDraft

main :: IO ()
main = do
  db <- fromEnv
  result <- createDraft db "hoge"
  print result
  return ()
