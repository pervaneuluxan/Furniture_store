import React,{useState, useEffect, } from 'react';
import { AppendStyle } from '../../utils/Append';
import PageTop2 from '../template/PageTop2';
import { getPostsByType } from '../../utils/Models';
import moment from 'moment';
import { NavLink } from 'react-router-dom';

export default function Blog(props){

    const [posts, setPosts] = useState([]);
    const [perPage, setPerPage] = useState(3)
    const [paginationCount, setPaginationCount] = useState([])
    const [totalPosts, setTotalPosts] = useState(0)
    
    const pathname=window.location.pathname.split('/'),
          get_page=parseInt(pathname[pathname.length-1]);
    const current_page=(!isNaN(get_page)&& get_page > 0) ? get_page:1;
    const prev_page=current_page-1;
    const next_page=current_page+1;

    useEffect(()=>{
        AppendStyle('blog')

        getPostsByType(8,perPage,current_page).then((res)=> {

            const res_data=res.data
          
           
           
            const posts=[];
            setTotalPosts(res_data.total)
         
            const pagination_count=Math.ceil(res_data.total / perPage);
            const temp_count=[...paginationCount];
    
            for(let i=1;    i <=pagination_count;i++){
                temp_count.push(i);
            }
    
            setPaginationCount(temp_count);
    
            for(let index in res_data.data){
                let row=res_data.data[index];
            
    
                posts.push({
                    title:row.title,
                    featured:row.featured,
                    excerpt:row.excerpt,
                    metas:row.metas,
                    link:row.slug,
                    date:row.date
                })
            }
          setPosts(posts);
        
        })
     },[])
    
    return(
        
     <>
       <PageTop2 id="8"/>
        
        <section className="blog_posts full_width">
            <div className="center">
                <div className="blog_posts_in full_width">
                    <ul className="posts_list full_width">
                      {
                          posts.map((item,key)=>{
                              return(
                                <li key={key}>
                                <NavLink to={"/read_blog/"+item.link}><img src={item.featured} alt={item.title}/></NavLink>
                                <span className="post_date">{moment(new Date(item.date)).format("D.MM.YYYY.")}</span>
                                <a href={"/read_blog/"+item.link} className="post_title">{item.title}</a>
                                <p className="post_content">
                                    {item.excerpt}
                                 </p>
                                 <NavLink to={"/read_blog/"+item.link}><span>Learn more</span><i className="mkd-icon-linear-icon lnr lnr-arrow-right "></i></NavLink>
                            </li>
                              )
                          })
                      }
                       
                          
                    </ul>
                    <div className="pagination full_width justify_center">
                        <ul className="pagination_list flex justify_center">
                           {
                               current_page >1 && <li><a href={"/blog/"+prev_page}><i className="mkd-icon-linear-icon lnr lnr-arrow-left mkd-icon-element"></i></a></li>
                           }
                            {
                               paginationCount.map((item,key)=>{
                                   let class_name=(current_page==item) ? 'active_list':''
                                   return(
                                    <li className={class_name}><a href={"/blog/"+item}>{item}</a></li>
                                   
                                   )
                               })
                            }
                            {
                                current_page!=paginationCount.length && 
                                <li>
                                    <a href={"/blog/"+next_page}><i className="mkd-icon-linear-icon lnr lnr-arrow-right mkd-icon-element"></i></a>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </section>

     </>
 

    )
}