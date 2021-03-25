import { gql, useMutation } from "@apollo/client";
import styled from 'styled-components';
import CartItem from "./CartItem";
import { CURRENT_USER_QUERY } from "./User";

const REMOVE_FROM_CART_MUTATION = gql`
    mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
        removeFromCart(id: $id) {
            id
        }
    }
`;

const BigButton = styled.button`
    font-size: 3rem;
    background: none;
    border: 0;
    &:hover {
        color: var(--red);
        cursor: pointer;
    }
`;

const RemoveFromCart = ({id}) => {
    const [deleteFromCart, {loading}] = useMutation(REMOVE_FROM_CART_MUTATION, {
        variables: { id },
        refetchQueries: [{query: CURRENT_USER_QUERY}]
        // update(cache, {data: { removeFromCart }}) {
        //     cache.evict(cache.identify(removeFromCart));
        //     cache.gc();
        // },
        // optimisticResponse: {
        //     // __typename: 'Mutation',
        //     removeFromCart: {
        //         __typename: 'CartItem',
        //         id,
        //     }
        // }
    })
    return (
        <BigButton 
            disabled={loading} 
            title="Delete Item" 
            onClick={() => { 
                deleteFromCart()
                .catch(err => alert(err.message))
            }} >&times;
        </BigButton>
    );
};

export default RemoveFromCart;