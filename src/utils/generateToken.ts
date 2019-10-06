import * as jwt from 'jsonwebtoken';

const generateToken = (userId: string): string =>
    jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '7 days' });

export { generateToken as default };
