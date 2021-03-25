export default function calcTotalPrice(cart) {
  return cart.reduce((tally, cartItem) => {
    if (!cartItem.item) return tally; // items can be deleted, but they could still be in your cart
    return tally + cartItem.quantity * cartItem.item.price;
  }, 0);
}