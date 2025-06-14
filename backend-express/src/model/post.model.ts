import { Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey } from 'sequelize';
import User from './user.model.js';

export default class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: CreationOptional<number>;

  declare UserId: ForeignKey<User['id']>;

  declare title: string;
  declare description: string;
  declare factory: string;
  declare status: string;
  declare imageUrl?: string[];
  declare category: string;

  declare user?: NonAttribute<User>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}