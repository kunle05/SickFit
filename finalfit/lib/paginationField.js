import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
    return {
        keyArgs: false,
        read(existing = [], { args, cache }) {
            const { skip, take, orderBy } = args;

            const data = cache.readQuery({ query: PAGINATION_QUERY });
            const count = data?.itemsCount;
            const page = skip / take + 1;
            const pages = Math.ceil(count / take);

            const items = existing.slice(skip, skip + take).filter(x => x);
            if(items.length && items.length !== take && page === pages) {
                return items;
            }
            if(items.length !== take) {
                return false;
            }
            if(items.length) {
                return items
            }
            return false;
        },
        merge(existing, incoming, { args }) {
            const { skip, take } = args;
            const merged = existing ? existing.slice(0) : [];
            for(let i = skip; i < skip + incoming.length; ++i) {
                merged[i] = incoming[i - skip];
            }
            return merged;
        }
    };
};