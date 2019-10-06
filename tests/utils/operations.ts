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

export { signup, login, getUsers, getProfile };
