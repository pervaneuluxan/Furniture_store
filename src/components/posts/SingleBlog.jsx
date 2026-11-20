import { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router';
import moment from 'moment';
import { AppendStyle } from '../../utils/Append';
import { getPostBySlug, getCategories, getPostsByType } from '../../utils/Models';

export default function SingleBlog() {
    const [post, setPost] = useState('');
    const [postTags, setPostTags] = useState([]);
    const [postGallery, setPostGallery] = useState([]);
    const [categories, setCategories] = useState([]);
    const [relatedPosts, setRelatedPosts] = useState([]);

    const { blog_link } = useParams();

    useEffect(() => {
        AppendStyle('singleBlog');
        getCategories('blog').then((res) => setCategories(res.data));
    }, []);

    useEffect(() => {
        getPostBySlug(blog_link).then((res) => {
            const data = res.data;
            setPost(data);
            setPostTags(data.categories ?? []);
            setPostGallery(data.metas.gallery ?? []);
        });

        getPostsByType('blog', { limit: 5, sort: 'popular' }).then((res) => {
            setRelatedPosts(
                res.data.data
                    .filter((row) => row.slug !== blog_link)
                    .slice(0, 4)
                    .map((row) => ({ title: row.title, featured: row.featured, link: row.slug, date: row.date }))
            );
        });
    }, [blog_link]);

    return (

        <>

            <section className="full_width single_post">
                <div className="center">
                    <div className="single_post_in full_width">
                        <img className="post_main_img" src={post.featured} alt={post.title} />
                        <h2 className="single_post_title">{post.title}</h2>

                        <div className="post_details full_width flex justify_flex_start align_center">
                            <div className="flex align_center">
                                <span className="post_date">{moment(new Date(post.date)).format("D.MM.YYYY.")}</span>
                                <div className="info_author">
                                    <span>By</span>
                                    <span>{post.author}</span>
                                </div>
                                <div className="comments_info">
                                    <i className="far fa-comment"></i>
                                    <span>2</span>
                                </div>
                            </div>
                            {
                                postTags && <ul className="post_tags flex align_center">
                                    {
                                        postTags.map((item, key) => {
                                            return (
                                                <li key={item.slug}><a href="#">{(key !== 0) ? ',' + item.title : item.title}</a></li>
                                            )
                                        })
                                    }
                                </ul>
                            }
                        </div>
                        <p className="post_content">
                            {post.content}
                        </p>
                        <p className="images_top_text">
                            The essence of positioning is sacrifice. You must
                            be willing to give up something in order to establish
                            that position.
                        </p>
                     {
                         postGallery &&    <ul className="post_gallery_list full_width flex justify_space_between">
                           {
                               postGallery.map((item,key)=>{
                                   return(
                                    <li key={key}><img src={item} alt="post_image" /></li>
                                   )
                               })
                           }

                         </ul>
                     }
                       
                        <p className="images_bottom_text">Lorem ipsum dolor sit amet, consectetur adipiscing eln ut ullamcorper
                            leo, eget euismod orci. Cum sociis natoque penatibus et magnis
                            dis parturient montes, nascetur ridiculus.
                        </p>
                        <p className="post_content">
                            {post.content}
                        </p>
                        <div className="blockquote">
                            <blockquote>“WAR AND MARKETING ARE SAME.”</blockquote>
                        </div>
                        <p className="post_content">
                            {post.content}
                        </p>
                       {
                           categories && <ul className="tag_list full_width flex align_center justify_center">
                           {
                               categories.map((item,key)=>{
                                   return(
                                        <li key={item.slug}><a href="#">{item.title}</a></li>
                                   )
                               })
                           }
                           </ul>
                       }
                        
                         
                    </div>
                </div>
            </section>

            <section className="full_width post_author">
                <div className="center">
                    <div className=" post_author_in full_width">
                        <div className="author_content full_width flex align_center justify_center">
                            <img src={post.author_image} alt="" />
                            <ul className="author_info_list">
                                <li><span>{post.author}</span></li>
                                <li><p>
                                    Lorem ipsum dolor sit amet, consectetur a elit. In ut ullamcorper leo, eget
                                    euismod orci.Cum sociis natoque penatibus et magnis dis parturient.
                                </p></li>
                                <li>
                                    <a href="#"><i className="fab fa-facebook-f"></i></a>
                                    <a href="#"><i className="fab fa-twitter"></i></a>
                                    <a href="#"><i className="fab fa-linkedin-in"></i></a>

                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="related_posts full_width">
                <div className="center">
                    <div className="related_posts_in full_width">
                        <h4>Related posts</h4>
                        <ul className="related_posts_list full_width flex">
                           {
                               relatedPosts.map((item,key)=>{
                                   return(
                                    <li key={item.link}>
                                        <NavLink to={"/read_blog/"+item.link}>
                                            <img src={item.featured} alt="" />
                                            <span className="post_overlay"></span>
        
                                        </NavLink>
                                        <span className="post_date">{moment(new Date(item.date)).format("D.MM.YYYY.")}</span>
                                        <h4><NavLink to={"/read_blog/"+item.link}>{item.title}</NavLink></h4>
                                    </li>
                                   )
                               })
                           }
                        </ul>
                    </div>
                </div>
            </section>

        </>


    )
}