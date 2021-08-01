"""users

Revision ID: 602fbd3eb4ff
Revises: 
Create Date: 2020-10-03 19:47:34.806024

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '602fbd3eb4ff'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('sqlite_sequence')
    op.drop_table('Users')
    op.drop_table('users_trial')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users_trial',
    sa.Column('User_id_ID', sa.INTEGER(), nullable=False),
    sa.Column('User_FIRST_NAME', sa.VARCHAR(), nullable=False),
    sa.Column('User_LAST_NAME', sa.VARCHAR(), nullable=False),
    sa.PrimaryKeyConstraint('User_id_ID')
    )
    op.create_table('Users',
    sa.Column('ID', sa.INTEGER(), nullable=False),
    sa.Column('username', sa.VARCHAR(), nullable=False),
    sa.Column('password_hash', sa.VARCHAR(), nullable=True),
    sa.PrimaryKeyConstraint('ID')
    )
    op.create_table('sqlite_sequence',
    sa.Column('name', sa.NullType(), nullable=True),
    sa.Column('seq', sa.NullType(), nullable=True)
    )
    # ### end Alembic commands ###