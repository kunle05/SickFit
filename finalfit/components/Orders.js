import { gql, useQuery } from "@apollo/client";
import { formatDistanceToNow } from 'date-fns';
import OrderItemStyles from '../components/styles/OrderItemStyles'
import ErrorMessage from '../components/ErrorMessage'
import formatMoney from "../lib/formatMoney";
import styled from 'styled-components';
import Link from 'next/link';

const ALL_ORDER_QUERY = gql`
    query ALL_ORDER_QUERY {
        orders {
            id
            total
            createdAt
            items {
                id
                image
                quantity
            }
        }
    }
`;

const OrderUI = styled.ul`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    grid-gap: 4rem;
`;

const CountItemsInOrder = order => {
    return order.items.reduce((tally, item) => (tally + item.quantity), 0);
};

const Orders = () => {
    const { loading, error, data } = useQuery(ALL_ORDER_QUERY);
    if(loading) return <p>loading...</p>
    if(error) return <ErrorMessage error={error.message} />
    const { orders } = data;

    return (
        <div>
            <h2>You have {orders.length} orders!</h2>
            <OrderUI>
                {orders.map((order, idx) => (
                    <OrderItemStyles key={idx}>
                        <Link href={{
                            pathname: '/order',
                            query: { id: order.id }
                        }}>
                            <a>
                            <div className="order-meta">
                                <p>{CountItemsInOrder(order)} Item</p>
                                {/* <p>{order.items.length} Product{order.items.length === 1 ? "" : "s"}</p> */}
                                <p>{ formatDistanceToNow( new Date(order.createdAt)) } ago</p>
                                <p>{formatMoney(order.total)}</p>
                            </div>
                            <div className="images">
                                {order.items.map(item => (
                                    <img key={item.id} src={item.image} alt={item.title} />
                                ))}
                            </div>
                            </a>
                        </Link>
                    </OrderItemStyles>
                ))}
            </OrderUI>
        </div>
    );
};

export default Orders;