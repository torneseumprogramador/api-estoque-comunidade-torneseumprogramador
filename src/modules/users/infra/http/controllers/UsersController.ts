import CreateUserService from '@modules/users/services/CreateUserService';
import { Request, Response } from 'express';

class UsersController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    // Com a atualização do TypeScript, isso se faz necessário

    return response.json(user);
  }
}

export default UsersController;
