import { gql, useMutation } from "@apollo/client";
// import { TOGGLE_CART_MUTATION } from "./Cart";
import { CURRENT_USER_QUERY } from "./User";

const ADD_TO_CART_MUTATION = gql`
    mutation ADD_TO_CART_MUTATION($id: ID!) {
        addToCart(id: $id) {
            id
        }
    }
`;

const AddToCart = ({ id }) => {
    const [addItemToCart, {loading}] = useMutation(ADD_TO_CART_MUTATION, {
        variables: { id },
        refetchQueries: [{ query: CURRENT_USER_QUERY }]
    });
    // const [toggle] = useMutation(TOGGLE_CART_MUTATION);

    return (
        <button disabled={loading} onClick={addItemToCart}>Add{loading && 'ing'} To Cart</button>
    );
};

export default AddToCart;