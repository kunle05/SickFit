import { gql, useQuery } from '@apollo/client';
import Head from 'next/head';
import styled from 'styled-components';
import ErrorMessage from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        getItem(id: $id) {
            id
            title
            price
            description
            largeImage
        }
    }
`;

const SingleItemStyles = styled.div`
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    max-width: var(--maxWidth);
    justify-content: center;
    /* margin: 2rem auto; */
    gap: 2rem;
    box-shadow: var(--bs);
    img {
        width: 100%;
        object-fit: contain;
    }
    .details {
        margin: 3rem;
        font-size: 2rem;
    }
`;

const SingleItem = ({id}) => {
    const { loading, error, data } = useQuery(SINGLE_ITEM_QUERY, { variables: { id } })
    if(loading) return <p>loading...</p>
    if(error) return <ErrorMessage error={error} />
    if(!data.getItem) return <p>No item Found for {id}</p>
    const item = data.getItem

    return (
        <SingleItemStyles>
            <Head>
                <title>Sick Fits | {item.title}</title>
            </Head>
            <img src={item.largeImage} alt={item.title} />
            <div className="details">
                <h2>Viewing {item.title}</h2>
                <p>{item.description}</p>
            </div>
        </SingleItemStyles>
    )
}

export default SingleItem;