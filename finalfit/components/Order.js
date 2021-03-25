import Head from 'next/head';
import { gql, useQuery } from "@apollo/client";
import { format } from 'date-fns';
import OrderStyles from '../components/styles/OrderStyles'
import ErrorMessage from '../components/ErrorMessage'
import formatMoney from "../lib/formatMoney";

const SINGLE_ORDER_QUERY = gql`
    query SINGLE_ORDER_QUERY($id: ID!) {
        order(id: $id) {
            id
            total
            charge
            createdAt
            items {
                id
                image
                title
                description
                price
                quantity
            }
        }
    }
`;

const Order = ({ id }) => {
    const { loading, error, data } = useQuery(SINGLE_ORDER_QUERY, {variables: {id} });
    if(loading) return <p>loading...</p>
    if(error) return <ErrorMessage error={error.message} />
    const { order } = data; 

    return (
        <OrderStyles>
            <Head>
                <title>Sick Fits - {order.id}</title>
            </Head>
            <p>
                <span>Order Id:</span>
                <span>{order.id}</span>
            </p>
            <p>
                <span>Charge:</span>
                <span>{order.charge}</span>
            </p>
            <p>
                <span>Order Total:</span>
                <span>{formatMoney(order.total)}</span>
            </p>
            <p>
                <span>Order Date:</span>
                <span>{format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}</span>
            </p>
            <p>
                <span>Items Count</span>
                <span>{order.items.length}</span>
            </p>
            <div className="items">
                {order.items.map(item => (
                    <div className="order-item" key={item.id}>
                        <img src={item.image} alt={item.title} />
                        <div className="item-details">
                            <h2>{item.title}</h2>
                            <p>Qty: {item.quantity}</p>
                            <p>Each: {formatMoney(item.price)}</p>
                            <p>Sub Total: {formatMoney(item.price * item.quantity)}</p>
                            <p>{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </OrderStyles>
    );
};

export default Order;