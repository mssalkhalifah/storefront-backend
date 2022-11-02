import { Response, Request } from 'express';
import { ICreateProduct } from './product.interfaces';
import  Product  from './product.model';

export default class ProductController {
  static async getAllProducts(_req: Request, res: Response): Promise<void>  {
    const products = await Product.index();

    res.status(200).json(products);
  }

  static async getProductById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const product = await Product.show(Number(id));

    res.status(200).json(product);
  }

  static async getProductsByCategory(req: Request, res: Response): Promise<void> {
    const { category } = req.params;
    const products = await Product.getAllByCategory(category);

    res.status(200).json(products);
  }

  static async createProduct(req: Request, res: Response): Promise<void>  {
    const { name, price, category } = req.body;
    const newProduct: ICreateProduct = {
      name: name,
      price: price,
      category: category,
    };

    const insertedProduct = await Product.create(newProduct);

    res.status(200).json(insertedProduct);
  }
}
