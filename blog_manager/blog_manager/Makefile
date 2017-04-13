.PHONY: s-dev
s-dev:
	. ../venv/bin/activate && ./manage.py runserver 0.0.0.0:8000 --settings=blog_manager.settings.dev

.PHONY: sh
sh:
	. ../venv/bin/activate && ./manage.py shell --settings=blog_manager.settings.dev

.PHONY: mig-dev
mig-dev:
	. ../venv/bin/activate && ./manage.py migrate --setting=blog_manager.settings.dev
