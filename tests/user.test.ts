import 'cross-fetch/polyfill';
import { ApolloClient } from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import * as jwt from 'jsonwebtoken';
import { photon } from '../src/photon';
import seedDatabase, { userOne, userTwo } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { signup, getUsers, login, getProfile } from './utils/operations';

const client: ApolloClient<NormalizedCacheObject> = getClient();

beforeEach(seedDatabase);

describe('Mutation', () => {
    describe('signup', () => {
        test('Should create a new user', async () => {
            const variables = {
                data: {
                    name: 'Jonathan',
                    email: 'jonathan@example.com',
                    password: 'thisisasecret',
                },
            };

            const response = await client.mutate({
                variables,
                mutation: signup,
            });
            const user = await photon.users.findOne({ where: { id: response.data.signup.user.id } });

            expect(user).not.toBeNull();
        });

        test('Should not create a user with email that is already in use', async () => {
            const variables = {
                data: {
                    name: 'Jonathan',
                    email: userOne.input.email,
                    password: 'thisisasecret',
                },
            };

            await expect(
                client.mutate({
                    variables,
                    mutation: signup,
                }),
            ).rejects.toThrowError('Email taken');
        });

        test('Should not create user with bad credentials', async () => {
            const variables = {
                data: {
                    name: 'Toto',
                    email: 'toto@alapla.ge',
                    password: '',
                },
            };

            await expect(
                client.mutate({
                    variables,
                    mutation: signup,
                }),
            ).rejects.toThrow('Password must be 8 characters or longer');
        });
    });

    describe('login', () => {
        test('Should login and provide authentication token', async () => {
            const variables = {
                data: {
                    email: userOne.input.email,
                    password: userOne.unhashedPassword,
                },
            };

            const { data } = await client.mutate({
                variables,
                mutation: login,
            });

            const payload = jwt.verify(data.login.token, process.env.JWT_SECRET as string) as { userId: string };

            expect(payload.userId).toBe(userOne.user.id);
        });

        test('Should not login with bad credentials', async () => {
            const variables = {
                data: {
                    email: 'toto@alapla.ge',
                    password: 'avecsonpwd',
                },
            };

            await expect(
                client.mutate({
                    variables,
                    mutation: login,
                }),
            ).rejects.toThrow('Invalid credentials');
        });
    });
});

describe('Query', () => {
    describe('users', () => {
        test('Should expose public author profiles', async () => {
            const response = await client.query({ query: getUsers });

            expect(response.data.users.length).toBe(2);
            expect(response.data.users[0].email).toBeNull();
            expect(response.data.users[0].name).toBe(userOne.input.name);
            expect(response.data.users[1].email).toBeNull();
            expect(response.data.users[1].name).toBe(userTwo.input.name);
        });
    });

    describe('me', () => {
        test('Should fetch user profile', async () => {
            const client = getClient(userOne.jwt);
            const { data } = await client.query({ query: getProfile });

            expect(data.me.id).toBe(userOne.user.id);
            expect(data.me.name).toBe(userOne.user.name);
            expect(data.me.email).toBe(userOne.user.email);
        });

        test('Should reject me query without authentication', async () => {
            await expect(client.query({ query: getProfile })).rejects.toThrow('Authentication required');
        });
    });
});
