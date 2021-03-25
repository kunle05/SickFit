import styled from 'styled-components';
import RequestReset from '../components/RequestReset';
import SignInForm from '../components/SignInForm';
import SignUpForm from "../components/SignUpForm";

const Columns = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 20px;
`;

const SignUp = () => (
    <Columns>
        <SignInForm />
        <SignUpForm />
        <RequestReset />
    </Columns>
)

export default SignUp;