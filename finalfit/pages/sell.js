import CreateItem from '../components/CreateItem';
import NotSignedIn from '../components/NotSignedIn';

const Sell = () => (
    <div>
        <NotSignedIn>
            <CreateItem />
        </NotSignedIn>
    </div>
)

export default Sell;