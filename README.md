# Flow

0. Prepare something to do all.

Use python and nodejs.

python: `pip install -r requirements.txt`.

node: `npm i`.

And, run watchdog to build JS.

`python chore.py watch`

Done.

1. Create article.

```
python chore.py new my-article
vim YYYY/MM/DD/my-article
```

Now edit.

2. Create meta informations.

```
python chore.py build
```

Then, updated `tagging.yml` and `articles/index.txt`.

(Don't forget `publish` flag of article yaml file to `true` if wanted to publish.)

3. Ensure article.

```
python -m http.server
```

Go [localhost:8000](http://localhost:8000)

4. Commit.

Published:sushi:
