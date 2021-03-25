import ResetForm from '../components/ResetForm';

const Reset = ({query}) => (
    <div>
        <ResetForm token={query.resetToken} />
    </div>
)

export default Reset;