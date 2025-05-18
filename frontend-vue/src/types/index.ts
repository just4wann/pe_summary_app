export type FeedType = {
  title: string;
  description: string;
  factory: string;
  status: string;
  createdAt: string;
  User: UserPostType;
};

export type FeedOfUserType = {
  title: string;
  description: string;
  factory: string;
  status: string;
  createdAt: string;
}

export type UserType = {
  id: number;
  username: string;
  fullname: string;
  nik: string;
};

export type FactoryType = {
  name: string;
  code: string;
};

export type FeedBodyType = {
  title: string;
  description: string;
  factory: string;
  status: string;
};

export type ClearValueType = {
  title: string;
  description: string;
  factory: FactorySelectedType;
  status: string;
};

export type FactorySelectedType = {
  name: string;
  code: string;
};

export type UserRegistRequestBody = {
  username: string;
  fullname: string;
  nik: string;
  password: string;
};

export type UserLoginRequestBody = {
  user: string;
  password: string;
};

export type ResponseAPI<T> = {
  data?: T;
  error?: boolean;
};

export type UserPostType = {
  fullname: string;
  username: string;
  nik: string;
};
