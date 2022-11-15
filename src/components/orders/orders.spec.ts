import { ISerializedUser } from '../../components/user/user.interfaces';
import { IProduct } from '../../components/product/product.interfaces';
import ErrorCodes from '../../errors/errorCodes';
import app from '../../server';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { ICreateOrder, ICreateOrderProduct, IOrder, IOrderProduct } from './orders.interfaces';

describe('Order component/', (): void => {
  let token: string;
  let user: ISerializedUser;
  let product: IProduct;
  let order: IOrder;

  beforeAll(async (): Promise<void> => {
    let result = await request(app).post('/user/create')
      .send({
        email: 'order@jasmine.com',
        firstname: 'order',
        lastname: 'jasmine',
        password: 'order123456789$',
      });
    
    token = `token=${result.text}`;
    user = jwt.verify(result.text, process.env.MY_SECRET_KEY!) as ISerializedUser;
    
    result = await request(app).post('/product').set('Cookie', token).send({
      'name': 'Forks super mega ultra deluxe',
      'price': '300',
      'category': 'kitchen ware',
    });
    
    product = result.body;
  });

  it('should return an empty list of orders', async (): Promise<void> => {
    const result = await request(app).get('/orders').set('Cookie', token);
    expect(result.body).toEqual([]);
  });

  it('should create and return a valid order', async (): Promise<void> => {
    const createOrder: ICreateOrder = {
      user_id: user.id,
    };
    const orderTest: IOrder = {
      id: 1,
      status: 'active',
      user_id: user.id,
    };
    
    const result = await request(app).post('/order/create')
      .set('Cookie', token)
      .send(createOrder);

    order = result.body;
    expect(result.body).toEqual(orderTest);
  });
  
  it('should add a product into an order', async (): Promise<void> => {
    const newOrderProduct: ICreateOrderProduct = {
      product_id: product.id,
      quantity: 1,
    };
    const orderProductTest: IOrderProduct = {
      order_id: order.id,
      product_id: newOrderProduct.product_id,
      quantity: newOrderProduct.quantity,
    };

    const result = await request(app).post(`/order/${order.id}/addProduct`)
      .set('Cookie', token)
      .send(newOrderProduct);
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(orderProductTest);
  });
  
  describe('error tests/', (): void => {
    describe('404 error tests/', (): void => {
      it('should return 404 if order id does not exist for /order/:id', async (): Promise<void> => {
        let result = await request(app).get('/order/9999').set('Cookie', token);
        expect(result.statusCode).toEqual(ErrorCodes.NOT_FOUND);
      });

      it('should return 404 if order id does not exist for /order/:id/orderProducts', async (): Promise<void> => {
        let result = await request(app).get('/order/9999/orderProducts').set('Cookie', token);
        expect(result.statusCode).toEqual(ErrorCodes.NOT_FOUND);
      });
    
      it('should return 404 if order id does not exist for /order/:id/product/:productId/update/quantity/:quantity', async (): Promise<void> => {
        let result = await request(app)
          .post('/order/9999/product/9999/update/quantity/9999')
          .set('Cookie', token);
        expect(result.statusCode).toEqual(ErrorCodes.NOT_FOUND);
      });
    
      it('should return 404 if order id does not exist for /order/:id/setcomplete', async (): Promise<void> => {
        let result = await request(app).post('/order/9999/setcomplete').set('Cookie', token);
        expect(result.statusCode).toEqual(ErrorCodes.NOT_FOUND);
      });
    
      it('should return 404 if order id does not exist for /order/:id/addProduct', async (): Promise<void> => {
        let result = await request(app)
          .post('/order/9999/addProduct')
          .set('Cookie', token)
          .send({ product_id: 0, quantity: 0 });
      
        expect(result.statusCode).toEqual(ErrorCodes.NOT_FOUND);
      });
    });

    describe('400 error tests/', (): void => {
      describe('test id for /order/:id', (): void => {
        it('should return 400 if id is a string', async (): Promise<void> => {
          let result = await request(app).get('/order/stringid').set('Cookie', token);
          expect(result.statusCode).toEqual(ErrorCodes.BAD_REQUEST);
        });

        it('should return 400 if id is a float', async (): Promise<void> => {
          let result = await request(app).get('/order/1.1').set('Cookie', token);
          expect(result.statusCode).toEqual(ErrorCodes.BAD_REQUEST);
        });
        
        it('should return 400 if id is a alphanumeric', async (): Promise<void> => {
          let result = await request(app).get('/order/1a').set('Cookie', token);
          expect(result.statusCode).toEqual(ErrorCodes.BAD_REQUEST);
        });
        
        describe('test id for /order/:id/orderProducts', (): void => {
          it('should return 400 if id is a string', async (): Promise<void> => {
            let result = await request(app).get('/order/string/orderProducts').set('Cookie', token);
            expect(result.statusCode).toEqual(ErrorCodes.BAD_REQUEST);
          });

          it('should return 400 if id is a float', async (): Promise<void> => {
            let result = await request(app).get('/order/1.1/orderProducts').set('Cookie', token);
            expect(result.statusCode).toEqual(ErrorCodes.BAD_REQUEST);
          });
        
          it('should return 400 if id is a alphanumeric', async (): Promise<void> => {
            let result = await request(app).get('/order/1a/orderProducts').set('Cookie', token);
            expect(result.statusCode).toEqual(ErrorCodes.BAD_REQUEST);
          });
          
        });
        
        describe('/order/:id/product/:productId/update/quantity/:quantity', (): void => {
          it('should return 400 if id is a string', async (): Promise<void> => {
            let result = await request(app)
              .post('/order/string/product/0/update/quantity/0')
              .set('Cookie', token);
            expect(result.statusCode).toEqual(ErrorCodes.BAD_REQUEST);
          });

          it('should return 400 if product id is a string', async (): Promise<void> => {
            let result = await request(app)
              .post('/order/0/product/string/update/quantity/0')
              .set('Cookie', token);
            expect(result.statusCode).toEqual(ErrorCodes.BAD_REQUEST);
          });
            
          it('should return 400 if quantity is a string', async (): Promise<void> => {
            let result = await request(app)
              .post('/order/0/product/0/update/quantity/string')
              .set('Cookie', token);
            expect(result.statusCode).toEqual(ErrorCodes.BAD_REQUEST);
          });

          it('should return 400 if id is a float', async (): Promise<void> => {
            let result = await request(app)
              .post('/order/1.1/product/0/update/quantity/0')
              .set('Cookie', token);
            expect(result.statusCode).toEqual(ErrorCodes.BAD_REQUEST);
          });
            
          it('should return 400 if product id is a float', async (): Promise<void> => {
            let result = await request(app)
              .post('/order/0/product/1.1/update/quantity/0')
              .set('Cookie', token);
            expect(result.statusCode).toEqual(ErrorCodes.BAD_REQUEST);
          });
            
          it('should return 400 if quantity is a float', async (): Promise<void> => {
            let result = await request(app)
              .post('/order/0/product/0/update/quantity/1.1')
              .set('Cookie', token);
            expect(result.statusCode).toEqual(ErrorCodes.BAD_REQUEST);
          });
            
          it('should return 400 if id is a alphanumeric', async (): Promise<void> => {
            let result = await request(app)
              .post('/order/1a/product/0/update/quantity/0')
              .set('Cookie', token);
            expect(result.statusCode).toEqual(ErrorCodes.BAD_REQUEST);
          });
            
          it('should return 400 if product id is a alphanumeric', async (): Promise<void> => {
            let result = await request(app)
              .post('/order/0/product/1a/update/quantity/0')
              .set('Cookie', token);
            expect(result.statusCode).toEqual(ErrorCodes.BAD_REQUEST);
          });
            
          it('should return 400 if quantity is a alphanumeric', async (): Promise<void> => {
            let result = await request(app)
              .post('/order/0/product/0/update/quantity/1a')
              .set('Cookie', token);
            expect(result.statusCode).toEqual(ErrorCodes.BAD_REQUEST);
          });
        });
        
        describe('/order/:id/setcomplete', (): void => {
          it('should return 400 if id is a string', async (): Promise<void> => {
            let result = await request(app)
              .post('/order/string/setcomplete')
              .set('Cookie', token);
            expect(result.statusCode).toEqual(ErrorCodes.BAD_REQUEST);
          });
          
          it('should return 400 if id is a float', async (): Promise<void> => {
            let result = await request(app)
              .post('/order/1.1/setcomplete')
              .set('Cookie', token);
            expect(result.statusCode).toEqual(ErrorCodes.BAD_REQUEST);
          });
          
          it('should return 400 if id is a alphanumeric', async (): Promise<void> => {
            let result = await request(app)
              .post('/order/1a/setcomplete')
              .set('Cookie', token);
            expect(result.statusCode).toEqual(ErrorCodes.BAD_REQUEST);
          });
        });
        
        describe('/order/:id/addProduct', (): void => {
          it('should return 400 if id is a string', async (): Promise<void> => {
            let result = await request(app)
              .post('/order/string/addProduct')
              .set('Cookie', token);
            expect(result.statusCode).toEqual(ErrorCodes.BAD_REQUEST);
          });
          
          it('should return 400 if id is a float', async (): Promise<void> => {
            let result = await request(app)
              .post('/order/1.1/addProduct')
              .set('Cookie', token);
            expect(result.statusCode).toEqual(ErrorCodes.BAD_REQUEST);
          });
          
          it('should return 400 if id is a alphanumeric', async (): Promise<void> => {
            let result = await request(app)
              .post('/order/1a/addProduct')
              .set('Cookie', token);
            expect(result.statusCode).toEqual(ErrorCodes.BAD_REQUEST);
          });
        });
      });
    });
  });
});
