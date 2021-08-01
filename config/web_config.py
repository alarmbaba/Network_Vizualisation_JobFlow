import os
basedir = os.getcwd()


class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'netviz'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir,'database','temp_db.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False