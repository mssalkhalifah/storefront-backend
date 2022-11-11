export interface ICreateUser {
  email: string,
  firstname: string,
  lastname: string,
  password: string
}

export interface IUser {
  id: number,
  email: string,
  firstname: string,
  lastname: string,
  user_password: string
} 

export interface ISerializedUser extends Omit<IUser, 'user_password'> {
  user_password?: string
  iat?: number,
  exp?: number,
}
