import { gql, useMutation, useQuery } from "@apollo/client";
import SickButton from "./styles/SickButton"
import CartStyles from "./styles/CartStyles"
import CloseButton from "./styles/CloseButton"
import Supreme from "./styles/Supreme"
import { useUser } from "./User";
import CartItem from "./CartItem";
import calcTotalPrice from "../lib/calcTotalPrice";
import formatMoney from "../lib/formatMoney";
import CheckOut from "./CheckOut";

const LOCAL_STATE_QUERY = gql`
    query {
        cartOpen @client
    }
`;

export const TOGGLE_CART_MUTATION = gql`
    mutation {
        toggleCart @client
    }
`;

const Cart = () => {
    const me = useUser();
    const { loading, data } = useQuery(LOCAL_STATE_QUERY);
    const [toggle] = useMutation(TOGGLE_CART_MUTATION)

    if(!me) return null;
    if(loading) return <p>loading...</p>
    return (
        <CartStyles open={data?.cartOpen}>
            <header>
                <CloseButton title="close" onClick={toggle}>&times;</CloseButton>
                <Supreme>{me.name}'s Cart</Supreme>
                <p>You have {me.cart.length} item{me.cart.length === 1 ? null : 's'} in your cart</p>
            </header>
            <ul>
                {me.cart.map(cartItem => <CartItem key={cartItem.id} item={cartItem} />)}
            </ul>
            <footer>
                <p>{ formatMoney(calcTotalPrice(me.cart)) }</p>
                <CheckOut />
            </footer>
        </CartStyles>
    );
};

export default Cart;