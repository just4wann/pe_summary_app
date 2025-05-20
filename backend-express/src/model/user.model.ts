import { Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
import Post from './post.model.js';

export default class User extends Model<InferAttributes<User, { omit: 'posts' }>, InferCreationAttributes<User, { omit: 'posts' }>> {
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