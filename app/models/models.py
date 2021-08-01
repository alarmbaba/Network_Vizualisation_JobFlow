"""************************************************************************************************
                                    Team Delight - NetViz
Author: Team Delight
Description: Module for database connections using ORM using Flask-SQLAlchemy

Modification History:
Date        Changed by              Description
04-10-2020  Marish_Varadaraj        Created a db modules for accessing the user details.
                                    User method for retriving user details from database
************************************************************************************************"""


from app import db, login
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
import string
import random


class User(UserMixin, db.Model):
    """
    User class where to retrive data from database for a given user.
    """
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(32), index=True, unique=True)
    userType = db.Column(db.String(32))
    password_hash = db.Column(db.String(128))
    password_changed = db.Column(db.Date)

    def __repr__(self) -> str:
        return '<User {}>'.format(self.username)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        if (self.password_hash == None):
            letters = string.ascii_lowercase
            self.password_hash =  ''.join(random.choice(letters) for i in range(12))
        return check_password_hash(self.password_hash, password)


@login.user_loader
def load_user(id):
    return User.query.get(int(id))
