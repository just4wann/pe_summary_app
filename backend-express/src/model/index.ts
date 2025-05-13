import { Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey } from 'sequelize';

export class User extends Model<InferAttributes<User, { omit: 'posts' }>, InferCreationAttributes<User, { omit: 'posts' }>> {
  declare id: CreationOptional<number>;
  declare username: string;
  declare fullname: string;
  declare nik: string;
  declare password: string;
  declare token?: string;

  declare posts?: NonAttribute<Post[]>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: CreationOptional<number>;

  declare UserId: ForeignKey<User['id']>;

  declare title: string;
  declare description: string;
  declare factory: string;
  declare status: string;

  declare user?: NonAttribute<User>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
