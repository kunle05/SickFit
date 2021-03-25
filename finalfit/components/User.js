import { gql, useQuery } from '@apollo/client';

export const CURRENT_USER_QUERY = gql`
    query CURRENT_USER_QUERY {
        me {
            id
            email
            name
            permissions
            cart {
                id
                quantity
                item {
                    title
                    description
                    price
                    image
                }
            }
        }
    }
`;

export function useUser() {
    const { data } = useQuery(CURRENT_USER_QUERY);
    return data?.me;
}

