import NotSignedIn from "../components/NotSignedIn";
import Orders from "../components/Orders";

const OrdersPage = () => (
    <NotSignedIn>
        <Orders />
    </NotSignedIn>
)

export default OrdersPage;