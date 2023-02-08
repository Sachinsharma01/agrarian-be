export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  salt: string;
  quizes: [];
  totalQuizes: number;
}

export interface IUserInputDTO {
  name: string;
  email: string;
  password: string;
}
