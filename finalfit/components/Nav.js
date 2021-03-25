import Link from 'next/link';
import SignOut from './SignOut';
import NavStyles from './styles/NavStyles';
import { useMutation } from '@apollo/client';
import { TOGGLE_CART_MUTATION } from './Cart';
import { useUser } from './User';
import CartCount from './CartCount';

const Nav = () => {
    const [toggle] = useMutation(TOGGLE_CART_MUTATION)
    const user = useUser();

    return (
        <NavStyles>
            <Link href="/products">
                Products
            </Link>
            { user && (
                <>
                    <Link href="/sell">
                        Sell
                    </Link>
                    <Link href="/orders">
                        Orders
                    </Link>
                    <Link href="/account">
                        Account
                    </Link>
                </>
            )}
            { !user && 
                <Link href="/signup">
                    Signin
                </Link>
            }
            { user && <>
                <button onClick={toggle}>My Cart <CartCount count={user.cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0) }></CartCount></button>
                <SignOut />
                </>
            }
        </NavStyles>
    );
};

export default Nav;