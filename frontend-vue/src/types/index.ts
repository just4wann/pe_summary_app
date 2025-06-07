export type FeedType = {
  id: number;
  title: string;
  description: string;
  factory: string;
  status: string;
  imageUrl?: string[];
  createdAt: string;
  updatedAt: string;
  User: UserPostType;
};

export type FeedOfUserType = {
  id: number;
  title: string;
  description: string;
  factory: string;
  status: string;
  imageUrl?: string[];
  createdAt: string;
  updatedAt: string;
};

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
  factory: FactorySelectedType
  status: string;
  imageUrl?: string[]
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

export type FeedUpdateBodyType = {
  title?: string;
  description?: string;
  factory?: FactorySelectedType;
  status?: string;
};

export type ProfileUpdateBodyType = {
  fullname?: string;
  username?: string;
  nik?: string;
}

export type FetchResponseType<T> = {
  statusCode: number;
  message: string;
  data: T
}

export type FetchResultType = {
  status: boolean;
  message: any;
}

export type TroubleDataRecordByDay = {
  value: number;
  timestamp: string;
};

export type TroubleDataRecordByFactory = {
  f1: number;
  f2: number;
  f3: number;
  f4: number;
  subpro: number;
  timestamp: string;
}
