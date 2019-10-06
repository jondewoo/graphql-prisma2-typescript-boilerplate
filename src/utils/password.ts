import * as bcrypt from 'bcryptjs';

const hashPassword = (password: string): Promise<string> => {
    if (password.length < 8) throw new Error('Password must be 8 characters or longer');
    return bcrypt.hash(password, 10);
};
const comparePasswords = (password: string, hash: string): Promise<boolean> => bcrypt.compare(password, hash);

export { hashPassword, comparePasswords };
