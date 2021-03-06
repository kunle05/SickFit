import PropTypes from 'prop-types';
import Link from 'next/link';
import Title from './styles/Title';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMoney';
import DeleteItem from './DeleteItem';
import AddToCart from './AddToCart';

const Item = props => {
    const { item } = props

    return (
        <ItemStyles>
            { item.image && <img src={item.image} alt={item.title} /> }
            <Title>
                <Link 
                    href={{
                        pathname: '/item/[id]',
                        query: { id: item.id }
                    }} 
                >
                    {item.title}
                </Link> 
            </Title>
            <PriceTag>{ formatMoney(item.price) }</PriceTag>
            <p>{item.description}</p>

            <div className="buttonList">
                <Link href={{
                    pathname: '/update',
                    query: { id: item.id } 
                }}>
                    Edit ✏️
                </Link>
                <AddToCart id={item.id} />
                <DeleteItem id={item.id}>Delete Item</DeleteItem>
            </div>
        </ItemStyles>
    )
}

Item.propTypes = {
    item: PropTypes.object.isRequired
}

export default Item;
