$de = "docker exec -ti editor"
$dt = "docker exec -ti -e EDITOR_ENV=test -e RUST_TEST_THREADS=1 -e DATABASE_URL=test.db -e RUST_BACKTRACE=full editor"
$cargo = "$de cargo"
$cargot = "$dt cargo"
$diesel = "$de diesel"
$dieselt = "$dt diesel"

switch ($Args[0]) 
{
    "up" {docker run -d --rm -ti --name editor --mount type=bind,source=${PWD},target=/source -p 3000:3000 editor /bin/sh}
    "build" {invoke-expression "$cargo build ${Args[1]}"}
    "run" {invoke-expression "$cargo run"}
    "watch" {invoke-expressoin "$cargo run --features 'watch'"}
    "cargo" {invoke-expression "$cargo ${Args[1]}"}
    "test" {invoke-expression "$cargot test -- --nocapture"}
    "diesel" {invoke-expression "$diesel ${Args[1]}"}
    "migration" {invoke-expression "$diesel migration ${Args[1]}"}
    "migration:test" {invoke-expression "$dieselt migration ${Args[1]}"}
    "sh" {invoke-expressin "$de sh"}
    default {invoke-expression "$de ${Args[1]}"}
}