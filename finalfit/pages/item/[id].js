import SingleItem from "../../components/SingleItem"

const item = ({ query }) => {
    const { id } = query
    return (
        <div>
            <SingleItem id={id} />
        </div>
    )
}

export default item;