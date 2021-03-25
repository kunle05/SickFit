import { useQuery } from '@apollo/client';
import { CURRENT_USER_QUERY } from './User';
import SignInForm from './SignInForm';

const NotSignedIn = props => {
    const { loading, data } = useQuery(CURRENT_USER_QUERY);
    if(loading) return <p>loading...</p>
    if(!data.me) return <div>
        <p>Please sign in to continue</p>
        <SignInForm />
    </div>

    return (
        <div>
            {props.children}
        </div>
    );
};

export default NotSignedIn;