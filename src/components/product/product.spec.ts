import { ICreateProduct, IProduct } from './product.interfaces';
import Product from './product.model';
import request from 'supertest';
import app from '../../server';

describe('Product Component', (): void => {
  const productTest: IProduct = {
    id: 1,
    name: 'Iphone 12',
    price: 599.99,
    category: 'electronics',
  };

  describe('model', (): void => {

    it('should initially return an empty array with index', async (): Promise<void> => {
      const result = await Product.index();
      expect(result).toEqual([]);
    });

    it('should insert a product', async (): Promise<void> => {
      const newProduct: ICreateProduct = {
        name: 'Iphone 12',
        price: 599.99,
        category: 'electronics',
      };

      const product: IProduct = await Product.create(newProduct);
      expect(product).toEqual(productTest);
    });

    it('should return array of length 1 with index', async (): Promise<void> => {
      const result = await Product.index();
      expect(result.length).toEqual(1);
    });

    describe('show method', ():void => {
      it('should return the correct product', async (): Promise<void> => {
        const product = await Product.show(1);
        expect(product).toEqual(productTest);
      });

      it('should return null if product not found', async (): Promise<void> => {
        const product = await Product.show(99);
        expect(product).toBeNull();
      });
    });

    describe('get produtcs by category', (): void => {
      it('should return list of products by category', async (): Promise<void> => {
        const products = await Product.getAllByCategory('electronics');
        expect(products).toEqual([productTest]);
      });

      it('should return null if category does not exist', async (): Promise<void> => {
        const products = await Product.getAllByCategory('it does not exist');
        expect(products).toBeNull();
      });
    });

    it('should have a method to display the top 5 most popular products');

  });

  describe('controller', (): void => {
    const productTest2 = structuredClone(productTest); 
    productTest2.id = 2;

    it('should insert a product', async (): Promise<void> => {
      const newProduct = await request(app).post('/product').send(productTest);

      expect(newProduct.body).toEqual(productTest2);
    });

    it('should return a valid list of items', async (): Promise<void> => {
      const products = await request(app).get('/products');

      expect(products.body).toEqual([productTest, productTest2]);
    });

    it('should return the correct product by id', async (): Promise<void> => {
      const product = await request(app).get('/products/1');

      expect(product.body).toEqual(productTest);
    });

    it('should return a list of valid products by category', async (): Promise<void> => {
      const products = await request(app).get('/products/category/electronics');

      expect(products.body).toEqual([productTest, productTest2]);
    });

    it('should return a null if a category does not exist', async (): Promise<void> => {
      const products = await request(app).get('/products/category/thisdoesnotexist');

      expect(products.body).toBeNull();
    });
  });
});
