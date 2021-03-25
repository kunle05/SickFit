import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import calcTotalPrice from '../lib/calcTotalPrice';
import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY, useUser } from './User';
import SickButton from './styles/SickButton';
import { useState } from 'react';
import nProgress from 'nprogress';
import {  TOGGLE_CART_MUTATION } from './Cart';

const CheckOutFormStyles = styled.form`
    box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.04);
    border-radius: 5px;
    padding: 1rem;
    display: grid;
    grid-gap: 1rem;
`;

const CREATE_ORDER_MUTATION = gql`
    mutation CREATE_ORDER_MUTATION($token: String!) {
        createOrder(token: $token) {
            id
        }
    }
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const CheckOutForm = () => {
    const router = useRouter();
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [placeOrder] = useMutation(CREATE_ORDER_MUTATION);
    const [closeCart, { error: graphError }] = useMutation(TOGGLE_CART_MUTATION)

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        nProgress.start();

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)
        });

        if(error) {
            setError(error);
            nProgress.done();
            return;
        }
        const order = await placeOrder({
            variables: {
                token: paymentMethod.id
            },
            refetchQueries: [{
                query: CURRENT_USER_QUERY
            }]
        }).catch(err => alert(err.message));
        closeCart();
        setLoading(false);
        nProgress.done();
        elements.getElement(CardElement).clear();
        router.push({
            pathname: '/order',
            query: { id: order.data.createOrder.id }
        })
    }
    
    return (
        <CheckOutFormStyles onSubmit={handleSubmit}>
            {error && <p style={{fontSize: 12}}>{error.message}</p>}
            {graphError && <p style={{fontSize: 12}}>{graphError.message}</p>}
            <CardElement />
            <SickButton disabled={loading || !stripe} type="submit">Checkout</SickButton>
        </CheckOutFormStyles>
    );
};

const CheckOut = () => (
    <Elements stripe={stripeLib}>
        <CheckOutForm />
    </Elements>
)


export default CheckOut;