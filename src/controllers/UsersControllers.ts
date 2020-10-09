import User from '@models/User';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import AppError from 'src/errors/AppError';
import { getRepository } from 'typeorm';
import { classToClass } from 'class-transformer';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;
    const userRepository = getRepository(User);
    let user = await userRepository.findOne({
      where: { email },
    });
    if (user) {
      throw new AppError('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    user = userRepository.create({ name, email, password: hashedPassword });
    await userRepository.save(user);
    return response.status(201).json({ user: classToClass(user) });
  }
}
