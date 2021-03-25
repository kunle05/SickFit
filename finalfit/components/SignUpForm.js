import { gql, useMutation } from '@apollo/client';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from './User';

const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION ($email: String!, $name: String!, $password: String!) {
        signup(data: {
            name: $name
            email: $email
            password: $password
        }) {
            id
            name
            email
        }
    }
`;

const SignUpForm = () => {

    const {inputs, handleChange, resetForm} = useForm({
        name: "",
        email: "",
        password: ""
    })
    const [signup, {error, loading}] = useMutation(SIGNUP_MUTATION, {
        variables: inputs,
        refetchQueries: [{
            query: CURRENT_USER_QUERY
        }]
    });

    return (
        <Form method="POST" onSubmit={async e => {
            e.preventDefault();
            await signup();
            resetForm();
        }}>
            <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign Up For An Account</h2>
                <ErrorMessage error={error} />
                <label htmlFor="name">
                    Name
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="name" 
                        value={inputs.name }
                        required
                        onChange= { handleChange }
                    />
                </label>
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
                <button type="submit">Sign Up!</button>
            </fieldset>
        </Form>
    )
}

export default SignUpForm;