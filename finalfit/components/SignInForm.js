import { gql, useMutation } from '@apollo/client';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from './User';
import { useRouter } from 'next/router';

const SIGNIN_MUTATION = gql`
    mutation SIGNIN_MUTATION ($email: String!, $password: String!) {
        signin(data: {
            email: $email
            password: $password
        }) {
            id
            name
            email
        }
    }
`;

const SignInForm = () => {
    const router = useRouter();
    const {inputs, handleChange, resetForm} = useForm({
        email: "",
        password: ""
    })
    const [signin, {error, loading}] = useMutation(SIGNIN_MUTATION, {
        variables: inputs,
        refetchQueries: [{
            query: CURRENT_USER_QUERY
        }]
    });

    return (
        <Form method="POST" onSubmit={async e => {
            e.preventDefault();
            await signin();
            resetForm();
            if(router.pathname == "/signup") {
                router.push("/products")
            }
        }}>
            <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign Into Your Account</h2>
                <ErrorMessage error={error} />
                <label htmlFor="email">
                    Email
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="email" 
                        value={inputs.email}
                        required
                        onChange= { handleChange }
                    />
                </label>
                <label htmlFor="password">
                    Password
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="password" 
                        value={inputs.password }
                        required
                        onChange= { handleChange }
                    />
                </label>
                <button type="submit">Sign In!</button>
            </fieldset>
        </Form>
    )
}

export default SignInForm;