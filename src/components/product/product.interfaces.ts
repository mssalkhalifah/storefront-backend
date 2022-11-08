export interface ICreateProduct {
  name: string,
  price: number,
  category: string,
  user_id?: number
}

export interface IProduct {
  id: number,
  name: string,
  price: number,
  category: string,
  user_id: number
}
