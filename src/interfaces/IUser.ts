export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  salt: string;
  image: string;
  isPaid: boolean;
}

export interface IUserInputDTO {
  name: string;
  email: string;
  password: string;
}
