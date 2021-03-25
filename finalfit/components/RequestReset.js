import { gql, useMutation } from '@apollo/client';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import useForm from '../lib/useForm';

const REQUEST_RESET_MUTATION = gql`
    mutation REQUEST_RESET_MUTATION ($email: String!) {
        requestReset(email: $email) {
            message
        }
    }
`;

const ResetForm = () => {

    const {inputs, handleChange, resetForm} = useForm({
        email: "",
    })
    const [reset, {error, loading, called}] = useMutation(REQUEST_RESET_MUTATION, {
        variables: inputs,
    });

    return (
        <Form method="POST" onSubmit={async e => {
            e.preventDefault();
            await reset();
            resetForm();
        }}>
            <fieldset disabled={loading} aria-busy={loading}>
                <h2>Request a password reset</h2>
                <ErrorMessage error={error} />
                {!error && !loading && called && <p>Success! Check your email for a reset link!</p>}
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
                <button type="submit">Request Reset!</button>
            </fieldset>
        </Form>
    )
}

export default ResetForm;