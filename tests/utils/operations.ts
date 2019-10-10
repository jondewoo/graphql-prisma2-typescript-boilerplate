import { gql } from 'apollo-boost';

const signup = gql`
    mutation($data: UserSignupInput!) {
        signup(data: $data) {
            token
            user {
                id
                name
                email
            }
        }
    }
`;

const getUsers = gql`
    query {
        users {
            id
            name
            email
        }
    }
`;

const login = gql`
    mutation($data: UserLoginInput!) {
        login(data: $data) {
            token
            user {
                id
                name
                email
            }
        }
    }
`;

const getProfile = gql`
    query {
        me {
            id
            name
            email
        }
    }
`;

const updateUser = gql`
    mutation($data: UserUpdateInput!) {
        updateUser(data: $data) {
            id
            name
            email
        }
    }
`;

const deleteUser = gql`
    mutation {
        deleteUser {
            id
            name
            email
        }
    }
`;

export { signup, login, getUsers, getProfile, updateUser, deleteUser };
