import React, { useState, useEffect } from 'react';
import { AppendStyle } from '../../utils/Append';
import { getPostBySlug,getCategories, getPostsByType } from '../../utils/Models';
import moment from 'moment';
import { NavLink } from 'react-router-dom';

export default function SingleBlog(props) {
    const [post, setPost] = useState('');
    const [postMetas, setPostMetas] = useState('');
    const [postTags, setPostTags] = useState('')
    const [postGallery, setPostGallery] = useState([]);
    const [categories, setCategories] = useState([]);
    const [relatedPosts, setRelatedPosts] = useState([])

    const blog_link = props.match.params.blog_link;
   

    useEffect(() => {
        AppendStyle('singleBlog');

        getPostBySlug(blog_link).then((res) => {
            let data = res.data;
            console.log(data);


            setPost(data);
            setPostMetas(data.metas);
            setPostTags(data.categories);

            const images=[...postGallery];

            for(let key in data.metas.gallery){
                let row=data.metas.gallery[key];

                images.push(row)
            }
            setPostGallery(images);
           

        })

        
        getCategories(8).then((res)=>{
            let data=res.data;

            setCategories(data)
        })

        // 
        getPostsByType(8,4,1,'p.view DESC').then((res)=>{
            let res_data=res.data;

            const posts=[];
      
        for(let index in res_data.data){
            let row=res_data.data[index];
          

            posts.push({
                title:row.title,
                featured:row.featured,
                link:row.slug,
                date:row.date
            })
        }

            setRelatedPosts(posts);
        })

    }, [])

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
                                    <a href="javascript:void(0);">{post.author}</a>
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
                                                <li><a href="#">{(key != 0) ? ',' + item.title : item.title}</a></li>
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
                                    <li><img src={item} alt="post_image" /></li>
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
                                        <li><a href="javascript:void(0);">{item.title}</a></li>
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
                                    <a href="javascript:void(0);"><i className="fab fa-facebook-f"></i></a>
                                    <a href="javascript:void(0);"><i className="fab fa-twitter"></i></a>
                                    <a href="javascript:void(0);"><i className="fab fa-linkedin-in"></i></a>

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
                                    <li>
                                        <NavLink to={"/read_blog/"+item.link}>
                                            <img src={item.featured} alt="" />
                                            <span className="post_overlay"></span>
        
                                        </NavLink>
                                        <span className="post_date">{moment(new Date(post.date)).format("D.MM.YYYY.")}</span>
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