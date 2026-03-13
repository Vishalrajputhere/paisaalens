import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';

export class AuthService {
  private static readonly SALT_ROUNDS = 12;

  static async registerUser(data: Partial<IUser>): Promise<{ user: IUser; token: string }> {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw { statusCode: 400, message: 'User with this email already exists' };
    }

    const passwordHash = await bcrypt.hash(data.passwordHash as string, this.SALT_ROUNDS);

    const user = new User({
      ...data,
      passwordHash,
    });

    await user.save();

    const token = this.generateToken(user.id);

    return { user, token };
  }

  static async loginUser(email: string, passwordPlain: string): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email });
    if (!user) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    const isValidPassword = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isValidPassword) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    const token = this.generateToken(user._id.toString());
    return { user, token };
  }

  static async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId).select('-passwordHash');
  }

  private static generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '7d' }
    );
  }
}
