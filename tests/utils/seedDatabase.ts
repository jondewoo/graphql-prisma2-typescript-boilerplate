import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { photon } from '../../src/photon';

const userOne = {
    input: {
        name: 'Test 1',
        email: 'test1@example.com',
        password: bcrypt.hashSync('thisisatest1'),
    },
    unhashedPassword: 'thisisatest1',
    user: undefined,
    jwt: undefined,
};

const userTwo = {
    input: {
        name: 'Test 2',
        email: 'test2@example.com',
        password: bcrypt.hashSync('thisisatest2'),
    },
    user: undefined,
    jwt: undefined,
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
