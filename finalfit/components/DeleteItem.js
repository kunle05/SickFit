import { gql, useMutation } from '@apollo/client';

const DELETE_ITEM_MUTATION = gql`
    mutation DELETE_ITEM_MUTATION($id: ID!) {
        deleteItem(id: $id) {
            id
            title
        }
    }
`;

const DeleteItem = props => {
    
    const [ deleteItem, { loading, error } ] = useMutation(DELETE_ITEM_MUTATION, {
        update(cache, { data: { deleteItem }}) {
            cache.evict(cache.identify(deleteItem));
        }
    })

    const handleDelete = () => {
        if(confirm('Are you sure you want to delete this item?')) {
            deleteItem({ variables: { id: props.id } })
            .catch(err => alert(err.message));
        }
    }

    return (
        <button disabled={loading} onClick={ handleDelete }>{props.children}</button>
    )
}

export default DeleteItem;