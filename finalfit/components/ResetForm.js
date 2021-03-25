import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from './User';

const RESET_PW_MUTATION = gql`
    mutation RESET_PW_MUTATION ($resetToken: String!, $password: String!, $confirmPassword: String!) {
        resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
            id
            name
            email
        }
    }
`;

const ResetForm = ({token}) => {
    const router = useRouter();

    const {inputs, handleChange, clearForm} = useForm({
        password: "",
        confirmPassword: ""
    });
    const [changePassword, {error, loading}] = useMutation(RESET_PW_MUTATION, {
        variables: {...inputs, resetToken: token},
        refetchQueries: [{
            query: CURRENT_USER_QUERY
        }]
    });

    return (
        <Form method="POST" onSubmit={async e => {
            e.preventDefault();
            await changePassword();
            clearForm();
            router.push('/products');
        }}>
            <fieldset disabled={loading} aria-busy={loading}>
                <h2>Request your password</h2>
                <ErrorMessage error={error} />
                <label htmlFor="password">
                    New Password
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="password" 
                        value={inputs.password}
                        required
                        onChange= { handleChange }
                    />
                </label>
                <label htmlFor="confirmPassword">
                    Confirm Password
                    <input 
                        type="password" 
                        name="confirmPassword" 
                        placeholder="confirmPassword" 
                        value={inputs.confirmPassword}
                        required
                        onChange= { handleChange }
                    />
                </label>
                <button type="submit">Reset Password!</button>
            </fieldset>
        </Form>
    )
}

export default ResetForm;