import os

from .base import *


DEBUG = True
DATABASES['default']['NAME'] = os.path.join(BASE_DIR, 'db.dev.sqlite3')