import { Sequelize, DataTypes } from 'sequelize';
import User from '@/model/user.model.js';
import Post from '@/model/post.model.js';

const sequelize: Sequelize = new Sequelize(process.env.DATABASE_URL!);

export class SequelizeDB {
  constructor() {}

  private defineModel() {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING(10),
          allowNull: false,
        },
        fullname: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        nik: {
          type: DataTypes.STRING(6),
          allowNull: false
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        token: {
          type: DataTypes.STRING,
          allowNull: true
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        tableName: 'users',
        sequelize,
      }
    );
    Post.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        factory: {
          type: DataTypes.STRING(15),
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING(10),
          allowNull: false,
        },
        imageUrl: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: true
        },
        category: {
          type: DataTypes.STRING(12),
          allowNull: false
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        tableName: 'posts',
        sequelize,
      }
    );
  }

  private defineAssociations() {
    User.hasMany(Post);
    Post.belongsTo(User);
  }

  public async connectDB() {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully');
    } catch (error) {
      console.error('Unable to connect to database', error);
    }
  }

  public async syncDB() {
    try {
      this.defineModel();
      this.defineAssociations();
      await sequelize.sync({ alter: true });
    } catch (error) {
      console.error('Cannot sync Model', error);
    }
  }
}
