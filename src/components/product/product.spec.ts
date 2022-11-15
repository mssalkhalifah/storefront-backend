import { ICreateUser, ISerializedUser } from '../../components/user/user.interfaces';
import { ICreateProduct, IProduct } from './product.interfaces';
import Product from './product.model';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../server';

describe('Product Component', (): void => {
  let testProduct: IProduct;
  let testUser: ISerializedUser;

  beforeAll(async (): Promise<void> => {
    const user: ICreateUser = {
      email: 'product@jasmine.com',
      firstname: 'product',
      lastname: 'jasmine',
      password: 'jasmine123@123',
    };
    
    const result = await request(app).post('/user/create').send(user);
    testUser = jwt.verify(result.text, process.env.MY_SECRET_KEY!) as ISerializedUser;
  });

  describe('model', (): void => {
    it('should insert a product', async (): Promise<void> => {
      const newProduct: ICreateProduct = {
        name: 'Iphone 12',
        price: 599.99,
        category: 'electronics',
        user_id: testUser.id,
      };
      
      const product: IProduct = await Product.create(newProduct);
      testProduct = product;
      expect(product).toEqual(testProduct);
    });

    it('should return array of length 1 or larger with index', async (): Promise<void> => {
      const result = await Product.index();
      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    describe('show method', ():void => {
      it('should return the correct product', async (): Promise<void> => {
        const product = await Product.show(testProduct.id);
        expect(product).toEqual(testProduct);
      });

      it('should return null if product not found', async (): Promise<void> => {
        const product = await Product.show(99);
        expect(product).toBeNull();
      });
    });

    describe('get produtcs by category', (): void => {
      it('should return list of products by category', async (): Promise<void> => {
        const products = await Product.getAllByCategory('electronics');
        expect(products?.length).toBeGreaterThanOrEqual(1);
      });

      it('should return null if category does not exist', async (): Promise<void> => {
        const products = await Product.getAllByCategory('it does not exist');
        expect(products).toBeNull();
      });
    });

    it('should have a method to display the top 5 most popular products');

  });

  describe('controller', (): void => {
    it('should return a valid list of items', async (): Promise<void> => {
      const products = await request(app).get('/products');

      expect(products.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should return the correct product by id', async (): Promise<void> => {
      const product = await request(app).get(`/products/${testProduct.id}`);

      expect(product.body).toEqual(testProduct);
    });

    it('should return error 400 if a string is used for id', async (): Promise<void> => {
      const product = await request(app).get('/products/stringID');

      expect(product.statusCode).toEqual(400);
    });

    it('should return a list of valid products by category', async (): Promise<void> => {
      const products = await request(app).get('/products/category/electronics');

      expect(products.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should return a null if a category does not exist', async (): Promise<void> => {
      const products = await request(app).get('/products/category/thisdoesnotexist');

      expect(products.body).toBeNull();
    });
  });
});
