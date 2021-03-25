import Products from "../../components/Products";

const ProductsPage = ({ query }) => {
  const { page } = query

  return (
    <div>
      <Products page={parseFloat(page) || 1} />
    </div>
  )
}
  
export default ProductsPage;