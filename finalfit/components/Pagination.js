import { gql, useQuery } from '@apollo/client';
import Head from 'next/head';
import Link from 'next/link';
import ErrorMessage from './ErrorMessage';
import PaginationStyles from './styles/PaginationStyles';
import { perPage } from '../config'
import { useRouter } from 'next/router';

export const PAGINATION_QUERY = gql`
    query PAGINATION_QUERY {
        itemsCount
    }
`;

const Pagination = props => {

    const router = useRouter();

    const { error, loading, data } = useQuery(PAGINATION_QUERY);
    if(loading) return <p>loading...</p>
    if(error) return <ErrorMessage error={ error } />
    
    const count = data.itemsCount
    const pages = Math.ceil(count / perPage);
    const { page } = props

    if(page > pages) {
        return <div>
            <p>No items to display on this page</p>
        </div>
    }

    return(
        <PaginationStyles>
            <Head>
                <title>Sick Fits! - Page {page} of { pages }</title>
            </Head>
            <Link href={`/products/${page - 1}`}>
                <a className="prev" aria-disabled= {page <= 1}> 
                    ⬅ Prev 
                </a> 
            </Link>
            <p>Page {page} of { pages }!</p>
            <p>{count} Items Total</p>
            <Link href={`/products/${page + 1}`}>
                <a className="next" aria-disabled={page >= pages}>
                    Next ➡
                </a>
            </Link>
        </PaginationStyles>
    )
}

export default Pagination;