import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { photon } from '../../src/photon';
import { User } from '@generated/photon';

type UserInput = { name: string; email: string; password: string };

const userOne: { input: UserInput; unhashedPassword: string; user: User; jwt?: string } = {
    input: {
        name: 'Test 1',
        email: 'test1@example.com',
        password: bcrypt.hashSync('thisisatest1'),
    },
    unhashedPassword: 'thisisatest1',
    user: { id: '', name: '', email: '', password: '' },
};

const userTwo: { input: UserInput; user: User; jwt?: string } = {
    input: {
        name: 'Test 2',
        email: 'test2@example.com',
        password: bcrypt.hashSync('thisisatest2'),
    },
    user: { id: '', name: '', email: '', password: '' },
};

const seedDatabase = async (): Promise<void> => {
    // Delete test database
    await photon.users.deleteMany({ where: null });

    // Create user one
    userOne.user = await photon.users.create({ data: userOne.input });
    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET as string);

    // Create user two
    userTwo.user = await photon.users.create({ data: userTwo.input });
    userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET as string);
};

export { seedDatabase as default, userOne, userTwo };
