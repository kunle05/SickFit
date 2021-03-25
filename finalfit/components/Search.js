import { gql, useLazyQuery } from '@apollo/client'
import { resetIdCounter, useCombobox } from 'downshift';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/dist/client/router';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_PRODUCTS_QUERY = gql`
    query SEARCH_PRODUCTS_QUERY($searchTerm: String) {
        searchTerms: getAllItems(searchTerm: $searchTerm) {
            id
            title
            image
        }
    }
`;

const Search = () => {
    const router = useRouter();
    const [findItems, {loading, data, error}] = useLazyQuery(SEARCH_PRODUCTS_QUERY, {
        fetchPolicy: 'no-cache'
    })
    const items = data?.searchTerms || [];
    const findItemsButChill = debounce(findItems, 1000);
    resetIdCounter();
    const { inputValue, getItemProps, highlightedIndex, isOpen, getMenuProps, getInputProps, getComboboxProps } = useCombobox({
        items,
        onInputValueChange() { 
            findItemsButChill({
                variables: {
                    searchTerm: inputValue
                }
            });
        },
        onSelectedItemChange({ selectedItem }) {
            console.log(selectedItem);
            router.push(`/item/${selectedItem.id}`);
        },
        itemToString: item => item?.title || '',
    });
    return <SearchStyles>
        <div {...getComboboxProps()}>
            <input {...getInputProps({
                type: 'search',
                placeholder: 'Search for an item',
                id: 'search',
                className: loading ? 'loading' : '',
            })} />
        </div>
        <DropDown {...getMenuProps()} >
            {isOpen && items.map((item, idx) => <DropDownItem key={item.id} {...getItemProps({ item })} highlighted={idx === highlightedIndex}>
                <img src={item.image} alt={item.name} width="50" />
                {item.title}
            </DropDownItem>)}
            {isOpen && !items.length && !loading && (
                <DropDownItem>Sorry, No items found for {inputValue}</DropDownItem>
            )}
        </DropDown>
    </SearchStyles>
}

export default Search;