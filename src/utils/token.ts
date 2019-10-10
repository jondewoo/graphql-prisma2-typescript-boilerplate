import * as jwt from 'jsonwebtoken';

const generateToken = (userId: string): string =>
    jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '7 days' });
const verifyToken = (token: string): { userId: string } =>
    jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

export { generateToken, verifyToken };
