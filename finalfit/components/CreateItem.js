import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import useForm from '../lib/useForm';

const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $description: String!
        $price: Int!
        $image: String
        $largeImage: String
    ) {
        createItem(data: {
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        }) {
            id
            title
        }
    }
`;

const CreateItem = () => {

    const router = useRouter();
    const {inputs, handleChange} = useForm({
        title: "",
        description: "",
        image: "",
        largeImage: "",
        price: 0
    })

    const [ createItem, { error, loading } ] = useMutation(CREATE_ITEM_MUTATION, {
        update(cache, { data: { createItem }}) {
            cache.modify({
                fields: {
                    getAllItems(existingItems = []) {
                        const newItem = cache.writeFragment({
                            data: createItem,
                            fragment: gql`
                                fragment NewItem on Item {
                                    id
                                    type
                                }
                            `
                        });
                        return [newItem, ...existingItems];
                    },
                    itemsCount(presentCount) {
                        return presentCount + 1
                    }
                }
            });
        }
    });

    return (
        <Form onSubmit={ async e => {
            e.preventDefault();
            let res = await createItem({ variables: inputs });
            router.push({
                pathname: '/item/[id]',
                query: { id: res.data.createItem.id }
            })
        }} >
            <ErrorMessage error={ error } />
            <fieldset disabled={loading} aria-busy={loading} >
                <label htmlFor="file">
                    Image
                    <input 
                        type="file" 
                        id="image" 
                        name="image" 
                        required
                        onChange= { handleChange }
                    />
                </label>
                    { inputs.image && <img width="200" src={inputs.image} alt="Upload Preview" /> }
                <label htmlFor="title">
                    Title
                    <input 
                        type="text" 
                        id="title" 
                        name="title" 
                        placeholder="title" 
                        required
                        value={ inputs.title }
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
                        value={ inputs.price }
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
                        value={ inputs.description }
                        onChange= { handleChange }
                    />
                </label>
                <button type="submit">Submit</button>
            </fieldset>
        </Form>
    );
};

export default CreateItem;