#! /bin/sh

py="venv/bin/python"
pip="venv/bin/pip"
chore="$py chore.py"

case $1 in
  init) pyvenv venv; $pip install -r requirements.txt; npm i;;
  n) $chore new $2;;
  s) $py -m http.server;;
  b) $chore build;;
  *) $chore $1;;
esac
