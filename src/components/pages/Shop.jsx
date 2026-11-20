import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { AppendStyle } from '../../utils/Append';
import PageBanner from '../template/PageBanner';
import { getPostsByType, getCategories } from '../../utils/Models';
import ProductItemBox from '../template/ProductItemBox';

const PER_PAGE = 8;
const SORT_OPTIONS = [
    ['default', 'Default'],
    ['popular', 'Popularity'],
    ['newest', 'Newness'],
    ['price_asc', 'Price: Low to High'],
    ['price_desc', 'Price: High to Low'],
];

export default function Shop() {
    const [posts, setPosts] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [categories, setCategories] = useState([]);

    const { page } = useParams();
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'default';

    const parsedPage = parseInt(page, 10);
    const current_page = parsedPage > 0 ? parsedPage : 1;

    // Keeps the active filters when moving between pages, and vice versa.
    const shopUrl = ({ toPage = 1, toCategory = category, toSort = sort } = {}) => {
        const query = new URLSearchParams();
        if (toCategory) query.set('category', toCategory);
        if (toSort !== 'default') query.set('sort', toSort);
        const qs = query.toString();
        return `/shop${toPage > 1 ? `/${toPage}` : ''}${qs ? `?${qs}` : ''}`;
    };

    useEffect(() => {
        AppendStyle('shop');
        getCategories('product').then((res) => setCategories(res.data));
    }, []);

    useEffect(() => {
        getPostsByType('product', { limit: PER_PAGE, page: current_page, sort, category: category || undefined })
            .then((res) => {
                const { data, total } = res.data;
                setPageCount(Math.max(1, Math.ceil(total / PER_PAGE)));
                setPosts(
                    data.map((row) => ({
                        id: row.id,
                        title: row.title,
                        featured: row.featured,
                        excerpt: row.excerpt,
                        metas: row.metas,
                        link: row.slug,
                        date: row.date,
                        has_discount: row.has_discount,
                        price: row.price,
                        discount_price: row.discount_price,
                        categories: row.categories,
                    }))
                );
            })
            .catch(() => setPosts([]));
    }, [current_page, sort, category]);

    const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

    return (
        <>
            <PageBanner slug="shop" />

            <section className="categories full_width flex">
                <div className="center full_height">
                    <div className="categories_in full_height flex align_center justify_space_between">
                        <ul className="categories_list full_height flex justify_center align_center">
                            <li className={category === '' ? 'active_list' : undefined}>
                                <Link to={shopUrl({ toCategory: '' })}>All</Link>
                            </li>
                            {categories.map((item) => (
                                <li key={item.slug} className={category === item.slug ? 'active_list' : undefined}>
                                    <Link to={shopUrl({ toCategory: item.slug })}>{item.title}</Link>
                                </li>
                            ))}
                        </ul>
                        <div className="mobile_categories flex direction_column">
                            <h6 className="mobile_categories_title">Categories</h6>
                            <ul className="mobile_categories_list flex direction_column">
                                <li><Link to={shopUrl({ toCategory: '' })}>All</Link></li>
                                {categories.map((item) => (
                                    <li key={item.slug}><Link to={shopUrl({ toCategory: item.slug })}>{item.title}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div className="filter flex align_center">
                            <h6>Filter</h6>
                            <div className="filter_dropdown flex justify_space_around">
                                <div className="filter_dropdown_left">
                                    <h5>Sort by</h5>
                                    <ul>
                                        {SORT_OPTIONS.map(([key, label]) => (
                                            <li key={key} className={sort === key ? 'active_list' : undefined}>
                                                <Link to={shopUrl({ toSort: key })}>{label}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="product full_width" style={{ marginTop: 0 }}>
                <div className="center">
                    <div className="product_in flex direction_column">
                        <ul className="product_list">
                            {posts.map((item) => (
                                <li key={item.id}><ProductItemBox item={item} /></li>
                            ))}
                        </ul>
                        <div className="pagination full_width flex justify_center">
                            <ul className="pagination_list">
                                {current_page > 1 && (
                                    <li>
                                        <Link to={shopUrl({ toPage: current_page - 1 })}>
                                            <i className="mkd-icon-linear-icon lnr lnr-arrow-left mkd-icon-element"></i>
                                        </Link>
                                    </li>
                                )}
                                {pages.map((item) => (
                                    <li key={item} className={current_page === item ? 'active_list' : undefined}>
                                        <Link to={shopUrl({ toPage: item })}>{item}</Link>
                                    </li>
                                ))}
                                {current_page < pageCount && (
                                    <li>
                                        <Link to={shopUrl({ toPage: current_page + 1 })}>
                                            <i className="mkd-icon-linear-icon lnr lnr-arrow-right mkd-icon-element"></i>
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
