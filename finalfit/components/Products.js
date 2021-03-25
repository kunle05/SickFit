import { useQuery, gql } from '@apollo/client';
import styled from 'styled-components';
import ErrorMessage from './ErrorMessage';
import Item from './Item';
import Pagination from './Pagination';
import { perPage } from '../config';

const Center = styled.div`
    text-align: center;
`;

const ItemsList= styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 60px;
    max-width: var(--maxWidth);
    margin: 0 auto;
`;

const ALL_ITEMS_QUERY = gql`
    query ALL_ITEMS_QUERY($skip: Int = 0, $take: Int = ${perPage})  {
        getAllItems(skip: $skip, take: $take, orderBy: {
            createdAt: "desc"
        }) {
            id
            title
            price
            description
            image   
        }
    }
`;

const AllItems = props => {
    const { loading, error, data } = useQuery(ALL_ITEMS_QUERY, { 
        variables: {
            skip: props.page * perPage - perPage
        }
    });

    if(loading) return <p>loading...</p> 
    if(error) return <ErrorMessage error={ error } />

    return (
        <Center>
            <Pagination page={props.page} />
            <ItemsList>
                { data?.getAllItems.map(item => (
                    <Item key={item.id} item={item} />
                )) }
            </ItemsList>
            <Pagination page={props.page} />
        </Center>
    ); 
};

const Products = props => {
    return (
        <Center>
            <AllItems page={props.page} />
        </Center>
    )
};

export default Products;