import { withApollo } from 'next-with-apollo';
import { ApolloClient, gql, createHttpLink, InMemoryCache } from '@apollo/client';
import { getDataFromTree } from '@apollo/client/react/ssr';
import { endPoint } from '../config';
import paginationField from './paginationField';

function createClient({ headers, initialState }) {

    const cache = new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    getAllItems: paginationField(),
                }
            },
            User: {
                fields: {
                    cart: {
                        merge(existing, incoming) {
                            return incoming
                        }
                    }
                }
            },
        }
    }).restore(initialState || {});
    cache.writeQuery({
        query: gql`
            query {
                cartOpen 
            }
        `,
        data: {
            cartOpen: false
        }
    })

    return new ApolloClient({
        ssrMode: true,
        link: createHttpLink({
            uri: endPoint,
            fetchOptions: {
                credentials: 'include'
            },
            headers
        }),
        cache,
        resolvers: {
            Mutation: {
                toggleCart: (_root, variables, { cache }) => {
                    cache.modify({
                        id: cache.identify({
                            __typename: 'Query',
                        }),
                        fields: {
                            cartOpen: value => !value
                        }
                    });
                    return null;
                }
            }
        }
    });
}

export default withApollo(createClient, { getDataFromTree });