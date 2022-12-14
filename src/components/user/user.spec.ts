import { ICreateUser, IUser } from './user.interfaces';
import DatabaseErrorCodes from '../../errors/dbErrorCodes';
import User from './user.model';
import ErrorCodes from '../../errors/errorCodes';
import request from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from '../../server';

describe('User component/', (): void => {
  const newUser: ICreateUser = {
    email: 'jasmine@test.com',
    firstname: 'test',
    lastname: 'jasmineTest',
    password: 'test12345@12345',
  };

  describe('user model/', (): void => {
    describe('create method/', (): void => {
      let insertedUser: IUser;

      beforeAll(async (): Promise<void> => {
        insertedUser = await User.create(newUser);
      });

      it('should return a valid email', (): void => {
        expect(insertedUser.email).toEqual(newUser.email);
      });

      it('should return a valid first name', (): void => {
        expect(insertedUser.firstname).toEqual(newUser.firstname);
      });

      it('should return a valid last name', (): void => {
        expect(insertedUser.lastname).toEqual(newUser.lastname);
      });

      it('should return a valid password', async (): Promise<void> => {
        const validPassword = await bcrypt.compare(newUser.password, insertedUser.user_password);
        expect(validPassword).toBeTrue();
      });

      it('should throw an error if the same email is inserted', async (): Promise<void> => {
        await expectAsync(User.create(newUser))
          .toBeRejectedWithError(DatabaseErrorCodes.UNIQUE_VIOLATION);
      });
    });

    describe('show method/', (): void => {
      const userId = 3;
      let selectedUser: IUser;

      beforeAll(async (): Promise<void> => {
        selectedUser = await User.show(userId);
      });

      it('should return a valid email', async (): Promise<void> => {
        expect(selectedUser.email).toEqual(newUser.email);
      });

      it('should return a valid firstname', async (): Promise<void> => {
        expect(selectedUser.firstname).toEqual(newUser.firstname);
      });

      it('should return a valid lastname', async (): Promise<void> => {
        expect(selectedUser.lastname).toEqual(newUser.lastname);
      });

      it('should return a valid password', async (): Promise<void> => {
        const validPassword = await bcrypt.compare(newUser.password, selectedUser.user_password);
        expect(validPassword).toBeTrue();
      });
    });

    describe('index method/', (): void => {
      it('should return a valid length of list of users', async (): Promise<void> => {
        const users = await User.index();
        expect(users.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('user controller/', (): void => {
    const newUserController: ICreateUser = {
      email: 'controller@jasmine.com',
      firstname: 'controller',
      lastname: 'jasmine',
      password: 'jasmine3@Test',
    };
  
    let token: string;

    describe('create method/', (): void => {
      it('should return an error code 409 if email is already used', async (): Promise<void> => {
        const result = await request(app).post('/user/create').send(newUser);
        expect(result.statusCode).toEqual(ErrorCodes.CONFLICT);
      });

      it('should return a valid token', async (): Promise<void> => {
        const result = await request(app).post('/user/create').send(newUserController);
        
        token = result.text;

        expect((): void => {
          jwt.verify(token, process.env.MY_SECRET_KEY!);
        }).not.toThrowError();
      });
    });

    describe('getUserById method/', (): void => {
      let getUser: IUser;

      beforeAll(async (): Promise<void> => {
        const result = await request(app).get('/user/me').set('Cookie', [`token=${token}`]);
        getUser = result.body;
      });

      it('should return a valid email', (): void => {
        expect(getUser.email).toEqual(newUserController.email);
      });

      it('should return a valid firstname', (): void => {
        expect(getUser.firstname).toEqual(newUserController.firstname);
      });

      it('should return a valid lastname', (): void => {
        expect(getUser.lastname).toEqual(newUserController.lastname);
      });

      it('should return a valid password', async (): Promise<void> => {
        const user = await User.show(getUser.id);
        const hashedPassword = user.user_password;
        const validPassword = await bcrypt.compare(newUserController.password, hashedPassword);
        expect(validPassword).toBeTrue();
      });

      it('should return error 404 if user does not exist', async (): Promise<void> => {
        const result = await request(app).get('/user/get/99999').set('Cookie', [`token=${token}`]);
        expect(result.status).toEqual(404);
      });
    });

    describe('getAllUsers method/', (): void => {
      it('should not return an empty list', async (): Promise<void> => {
        const result = await request(app).get('/user/all').set('Cookie', [`token=${token}`]);
        expect(Array.from(result.body).length).toBeGreaterThanOrEqual(1);
      });
    });
  });
});
