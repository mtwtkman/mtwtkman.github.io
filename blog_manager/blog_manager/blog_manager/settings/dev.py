import os

from .base import *


DATABASES['default']['NAME'] = os.path.join(BASE_DIR, 'db.dev.sqlite3')
