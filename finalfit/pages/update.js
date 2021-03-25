import UpdateProduct from '../components/UpdateProduct';
import NotSignedIn from '../components/NotSignedIn';

const Update = ({ query }) => {
    const { id } = query;
    return <div>
        <NotSignedIn>
            <UpdateProduct id={id} />
        </NotSignedIn>
    </div>
}

export default Update;