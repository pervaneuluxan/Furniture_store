import { useState, useEffect } from 'react';
import { NavLink, Link, useParams } from 'react-router';
import moment from 'moment';
import { AppendStyle } from '../../utils/Append';
import PageTop2 from '../template/PageTop2';
import { getPostsByType } from '../../utils/Models';

const PER_PAGE = 3;

export default function Blog() {
    const [posts, setPosts] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    const { page } = useParams();
    const parsedPage = parseInt(page, 10);
    const current_page = parsedPage > 0 ? parsedPage : 1;

    useEffect(() => {
        AppendStyle('blog');
    }, []);

    useEffect(() => {
        getPostsByType('blog', { limit: PER_PAGE, page: current_page, sort: 'newest' })
            .then((res) => {
                const { data, total } = res.data;
                setPageCount(Math.max(1, Math.ceil(total / PER_PAGE)));
                setPosts(
                    data.map((row) => ({
                        title: row.title,
                        featured: row.featured,
                        excerpt: row.excerpt,
                        metas: row.metas,
                        link: row.slug,
                        date: row.date,
                    }))
                );
            })
            .catch(() => setPosts([]));
    }, [current_page]);

    const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
    const pageUrl = (n) => (n > 1 ? `/blog/${n}` : '/blog');

    return (
        <>
            <PageTop2 slug="blog" />

            <section className="blog_posts full_width">
                <div className="center">
                    <div className="blog_posts_in full_width">
                        <ul className="posts_list full_width">
                            {posts.map((item) => (
                                <li key={item.link}>
                                    <NavLink to={'/read_blog/' + item.link}><img src={item.featured} alt={item.title} /></NavLink>
                                    <span className="post_date">{moment(new Date(item.date)).format('D.MM.YYYY.')}</span>
                                    <Link to={'/read_blog/' + item.link} className="post_title">{item.title}</Link>
                                    <p className="post_content">{item.excerpt}</p>
                                    <NavLink to={'/read_blog/' + item.link}><span>Learn more</span><i className="mkd-icon-linear-icon lnr lnr-arrow-right "></i></NavLink>
                                </li>
                            ))}
                        </ul>
                        <div className="pagination full_width justify_center">
                            <ul className="pagination_list flex justify_center">
                                {current_page > 1 && (
                                    <li><Link to={pageUrl(current_page - 1)}><i className="mkd-icon-linear-icon lnr lnr-arrow-left mkd-icon-element"></i></Link></li>
                                )}
                                {pages.map((item) => (
                                    <li key={item} className={current_page === item ? 'active_list' : undefined}>
                                        <Link to={pageUrl(item)}>{item}</Link>
                                    </li>
                                ))}
                                {current_page < pageCount && (
                                    <li><Link to={pageUrl(current_page + 1)}><i className="mkd-icon-linear-icon lnr lnr-arrow-right mkd-icon-element"></i></Link></li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
