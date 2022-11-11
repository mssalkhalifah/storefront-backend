export interface ICreateOrder {
  user_id: number
}

export interface IOrder {
  id: number,
  status: number,
  user_id: number
}

export interface IOrderProduct {
  order_id: number,
  product_id: number,
  quantity: number
}

export interface IOrderProductSerialized {
  order_id: number,
  product_id?: number,
  quantity: number
}
