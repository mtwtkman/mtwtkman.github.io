module Blog.Datastore.Sqlite where

import System.Environment
import Database.SQLite.Simple

newtype Db = Db FilePath


fromEnv :: IO Db
fromEnv = Db <$> getEnv "BLOG_DB"

makeConnection :: Db -> IO Connection
makeConnection (Db fp) = open fp
