import NotSignedIn from "../components/NotSignedIn";
import Order from "../components/Order";

const OrderPage = ({ query }) => (
    <NotSignedIn>
        <Order id={query.id} />
    </NotSignedIn>
)

export default OrderPage;