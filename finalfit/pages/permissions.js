import NotSignedIn from '../components/NotSignedIn';
import PermissionsForm from '../components/PermissionsForm';

const Permissions = () => (
    <div>
        <NotSignedIn>
            <PermissionsForm />
        </NotSignedIn>
    </div>
)

export default Permissions;