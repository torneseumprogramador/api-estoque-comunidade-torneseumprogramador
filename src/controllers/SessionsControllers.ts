import User from '@models/User';
import { sign } from 'jsonwebtoken';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import AppError from '@errors/AppError';
import { getRepository } from 'typeorm';
import authConfig from '@config/auth';
import { classToClass } from 'class-transformer';

export default class SessionsControllers {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      throw new AppError('Invalid email/password combination');
    }
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new AppError('Invalid email/password combination');
    }
    const { expiresIn, secret } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });
    return response.json({
      user: classToClass(user),
      token,
    });
  }
}
