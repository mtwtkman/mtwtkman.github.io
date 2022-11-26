module Resource exposing (buildResourcePath)

import Url.Builder exposing (relative)


buildPath : List String -> String
buildPath paths =
    relative paths []


root : String
root =
    buildPath [ ".", "resources" ]


buildResourcePath : List String -> String
buildResourcePath paths =
    buildPath (root :: paths)
