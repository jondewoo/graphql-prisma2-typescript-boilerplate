import 'cross-fetch/polyfill';
import { ApolloClient } from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { photon } from '../src/photon';
import { comparePasswordsSync } from '../src/utils/password';
import { generateToken, verifyToken } from '../src/utils/token';
import seedDatabase, { userOne, userTwo } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { signup, getUsers, login, getProfile, updateUser, deleteUser } from './utils/operations';

const client: ApolloClient<NormalizedCacheObject> = getClient();

beforeEach(seedDatabase);

afterAll(async () => await photon.disconnect());

describe('Mutation', () => {
    describe('signup', () => {
        test('Should create a new user', async () => {
            // Arrange
            const variables = {
                data: {
                    name: 'Jonathan',
                    email: 'jonathan@example.com',
                    password: 'thisisasecret',
                },
            };

            // Act
            const { data } = await client.mutate({
                variables,
                mutation: signup,
            });

            // Assert
            const { user, token } = data.signup;

            expect(user.name).toBe(variables.data.name);
            expect(user.email).toBe(variables.data.email);
            expect(user.password).toBeUndefined();

            const dbUser = await photon.users.findOne({ where: { id: user.id } });
            expect(dbUser).not.toBeNull();
            expect(dbUser.name).toBe(variables.data.name);
            expect(dbUser.email).toBe(variables.data.email);
            expect(comparePasswordsSync(variables.data.password, dbUser.password)).toBe(true);

            const payload = verifyToken(token);
            expect(payload.userId).toBe(dbUser.id);
        });

        test('Should not create a user with email that is already in use', async () => {
            // Arrange
            const variables = {
                data: {
                    name: 'Jonathan',
                    email: userOne.input.email,
                    password: 'thisisasecret',
                },
            };

            // Act & Assert
            await expect(
                client.mutate({
                    variables,
                    mutation: signup,
                }),
            ).rejects.toThrowError('Email taken');
        });

        test('Should not create user with bad credentials', async () => {
            // Arrange
            const variables = {
                data: {
                    name: 'Toto',
                    email: 'toto@alapla.ge',
                    password: '',
                },
            };

            // Act & Assert
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
            // Arrange
            const variables = {
                data: {
                    email: userOne.input.email,
                    password: userOne.unhashedPassword,
                },
            };

            // Act
            const { data } = await client.mutate({
                variables,
                mutation: login,
            });

            // Assert
            const { user, token } = data.login;

            expect(user.name).toBe(userOne.user.name);
            expect(user.email).toBe(userOne.user.email);
            expect(user.password).toBeUndefined();

            const payload = verifyToken(token);
            expect(payload.userId).toBe(userOne.user.id);
        });

        test('Should not login with bad credentials (unknown user)', async () => {
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

        test('Should not login with bad credentials (incorrect password)', async () => {
            const variables = {
                data: {
                    email: userOne.input.email,
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

    describe('updateUser', () => {
        test('Should update an existing user (with password)', async () => {
            // Arrange
            const client = getClient(userOne.jwt);
            const variables = {
                data: {
                    name: 'A. Neuman',
                    email: 'a.neuman@example.com',
                    password: 'thisissupersecret',
                },
            };

            // Act
            const { data } = await client.mutate({
                variables,
                mutation: updateUser,
            });

            // Assert
            const { id, name, email } = data.updateUser;

            expect(id).toBe(userOne.user.id);
            expect(name).toBe(variables.data.name);
            expect(email).toBe(variables.data.email);

            const dbUser = await photon.users.findOne({ where: { id: userOne.user.id } });
            expect(dbUser).not.toBeNull();
            expect(dbUser.name).toBe(variables.data.name);
            expect(dbUser.email).toBe(variables.data.email);
            expect(comparePasswordsSync(variables.data.password, dbUser.password)).toBe(true);
        });

        test('Should update an existing user (without password)', async () => {
            // Arrange
            const client = getClient(userOne.jwt);
            const variables = {
                data: {
                    name: 'A. Neuman',
                    email: 'a.neuman@example.com',
                },
            };

            // Act
            const { data } = await client.mutate({
                variables,
                mutation: updateUser,
            });

            // Assert
            const { id, name, email } = data.updateUser;

            expect(id).toBe(userOne.user.id);
            expect(name).toBe(variables.data.name);
            expect(email).toBe(variables.data.email);

            const dbUser = await photon.users.findOne({ where: { id: userOne.user.id } });
            expect(dbUser).not.toBeNull();
            expect(dbUser.name).toBe(variables.data.name);
            expect(dbUser.email).toBe(variables.data.email);
            expect(dbUser.password).not.toBeFalsy();
        });

        test('Should fail if user does not exist', async () => {
            // Arrange
            const client = getClient(generateToken('thisiddoesnotexist'));
            const variables = {
                data: {
                    name: 'A. Neuman',
                    email: 'a.neuman@example.com',
                },
            };

            // Act & Assert
            await expect(
                client.mutate({
                    variables,
                    mutation: updateUser,
                }),
            ).rejects.toThrowError('User not found');
        });
    });

    describe('deleteUser', () => {
        test('Should delete an existing user', async () => {
            // Arrange
            const client = getClient(userOne.jwt);

            // Act
            const { data } = await client.mutate({
                mutation: deleteUser,
            });

            // Assert
            const { id, name, email } = data.deleteUser;

            expect(id).toBe(userOne.user.id);
            expect(name).toBe(userOne.user.name);
            expect(email).toBe(userOne.user.email);

            await expect(photon.users.findOne({ where: { id: userOne.user.id } })).rejects.toThrowError(
                'Record does not exist',
            );
        });

        test('Should fail if user does not exist', async () => {
            // Arrange
            const client = getClient(generateToken('thisiddoesnotexist'));

            // Act & Assert
            await expect(
                client.mutate({
                    mutation: deleteUser,
                }),
            ).rejects.toThrowError('User not found');
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

        test('Should expose public author profiles and own private profile', async () => {
            const client = getClient(userOne.jwt);
            const response = await client.query({ query: getUsers });

            expect(response.data.users.length).toBe(2);
            expect(response.data.users[0].email).toBe(userOne.input.email);
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
