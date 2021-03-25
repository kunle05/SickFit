import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import useForm from '../lib/useForm';

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY(
        $id: ID!
    ) {
        getItem(id: $id) {
            id
            title
            price
            description
        }
    }
`;

const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION(
        $id: ID!
        $title: String
        $price: Int
        $description: String
    ) {
        updateItem(data: {
            id: $id
            title: $title
            price: $price
            description: $description
        }) {
            id
            price
        }
    }
`;

const UpdateProduct = ({id}) => {

    const router = useRouter();
    const { loading, data } = useQuery(SINGLE_ITEM_QUERY, {
        variables: { id }
    });
    const [ updateItem, { error, loading: updateLoading } ] = useMutation(UPDATE_ITEM_MUTATION)
    const {inputs, handleChange} = useForm(data?.getItem)

    if (loading) return <p>loading ...</p>
    if (!data.getItem)  return <p>No Item Found for ID {id}</p>

    return (
        <Form onSubmit={ async e => {
            e.preventDefault();
            let res = await updateItem({ variables: { 
                id, 
                title: inputs.title,
                price: inputs.price,
                description: inputs.description
            }});
            //update single item cache and all item cache
            router.push({
                pathname: '/item/[id]',
                query: { id: res.data.updateItem.id }
            })
        }} >
            <ErrorMessage error={ error } />
            <fieldset disabled={updateLoading} aria-busy={updateLoading} >
                <label htmlFor="title">
                    Title
                    <input 
                        type="text" 
                        id="title" 
                        name="title" 
                        placeholder="title" 
                        required
                        defaultValue= { data.getItem.title }
                        onChange= { handleChange }
                    />
                </label>
                <label htmlFor="price">
                    Price
                    <input 
                        type="number" 
                        id="price" 
                        name="price" 
                        placeholder="price" 
                        required
                        defaultValue= { data.getItem.price }
                        onChange= { handleChange }
                    />
                </label>
                <label htmlFor="description">
                    description
                    <textarea
                        id="description" 
                        name="description" 
                        placeholder="Enter A Description" 
                        required
                        defaultValue= { data.getItem.description }
                        onChange= { handleChange }
                    />
                </label>
                <button type="submit">Sav{updateLoading ? 'ing Changes' : 'e Changes'}</button>
            </fieldset>
        </Form>
    ); 
}

export default UpdateProduct;