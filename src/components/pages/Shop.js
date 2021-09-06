import React,{useState, useEffect } from 'react';
import { AppendStyle } from '../../utils/Append';
import PageBanner from '../template/PageBanner';
import { getPostsByType,getCategories } from '../../utils/Models';
import ProductItemBox from '../template/ProductItemBox';

export default function Shop(props){
    const [posts, setPosts] = useState([]);
    const [perPage, setPerPage] = useState(8)
    const [paginationCount, setPaginationCount] = useState([]);
    const [categories, setCategories] = useState([]);
    
    const pathname=window.location.pathname.split('/'),
          get_page=parseInt(pathname[pathname.length-1]);

    const current_page=(!isNaN(get_page)&& get_page > 0) ? get_page:1;
    const prev_page=current_page-1;
    const next_page=current_page+1;
    
      useEffect(()=>{
          AppendStyle('shop')
          getPostsByType(10,perPage,current_page).then((res)=> {
  
            const res_data=res.data
            const posts=[];
    
         
            const pagination_count=Math.ceil(res_data.total / perPage);
            const temp_count=[...paginationCount];
    
            for(let i=1;    i <=pagination_count;i++){
                temp_count.push(i);
            }
    
            setPaginationCount(temp_count);
    
            for(let index in res_data.data){
                let row=res_data.data[index];
               
                let discount=row.metas.discount,
                price=row.metas.price,
                discount_start_date = new Date(row.metas.discount_start_date),
                discount_end_date = new Date(row.metas.discount_end_date),
                now_date=new Date(),
                calc_discount=(price * (100 - discount)) / 100;
              
                console.log(calc_discount);
              let has_discount=(discount_start_date <= now_date && discount_end_date >= now_date) ? true:false;
              
              posts.push({
                    id:row.id,
                    title:row.title,
                    featured:row.featured,
                    excerpt:row.excerpt,
                    metas:row.metas,
                    link:row.slug,
                    date:row.date,
                    has_discount:has_discount,
                    price:price,
                    discount_price:calc_discount
                })
               
            }
          setPosts(posts);
            
    
        })
        getCategories(10).then((res)=>{
          let data=res.data;
          setCategories(data)
      })
  

      },[])
  
    return(
        
     <>
    <PageBanner id="10"/>

        <section className="categories full_width flex">
            <div className="center full_height">
                <div className="categories_in full_height flex align_center justify_space_between">
                    <ul className="categories_list full_height flex justify_center align_center">
                      {
                          categories.map((item,key)=>{
                              return(
                                <li><a href={"/category/"+item.slug}>{item.title}</a></li>
                              )
                            
                          })
                      }
                    </ul>
                    <div className="mobile_categories flex direction_column">
                        <h6 className="mobile_categories_title">Categories</h6>
                        <ul className="mobile_categories_list flex direction_column">
                        {
                          categories.map((item,key)=>{
                              return(
                                <li><a href={"/category/"+item.slug}>{item.title}</a></li>
                              )
                            
                          })
                      }
                        </ul>
                    </div>
                    <div className="filter flex align_center">
                        <h6>Filter</h6>
                        <div className="filter_dropdown flex justify_space_around">
                            <div className="filter_dropdown_left">
                                <h5>Sort by</h5>
                                <ul>
                                    <li><a href="#">Default</a></li>
                                    <li><a href="#">Popularity</a></li>
                                    <li><a href="#">Average rating</a></li>
                                    <li><a href="#">Newness</a></li>
                                    <li><a href="#">Price: Low to High</a></li>
                                    <li><a href="#">Price: High to Low</a></li>
                                </ul>
                            </div>
                            <div className="filter_dropdown_right">
                                <h5>Price range</h5>
                                <ul>
                                    <li><a href="#">All</a></li>
                                    <li><a href="#">$0-$10</a></li>
                                    <li><a href="#">$10-$20</a></li>
                                    <li><a href="#">$20-$30</a></li>
                                    <li><a href="#">$30-$40</a></li>
                                    <li><a href="#">40$</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="product full_width" style={{'marginTop':'0!important'}}>

            <div className="center">
                <div className="product_in flex direction_column">
                    <ul className="product_list">
                        {
                           posts && posts.map((item,key)=>{
                                return(
                                   <ProductItemBox item={item}/>
                                )
                            }) 
                        }
                    </ul>
                    <div className="pagination full_width flex justify_center">
                        <ul className="pagination_list">
                        {
                               current_page >1 && <li><a href={"/shop/"+prev_page}><i className="mkd-icon-linear-icon lnr lnr-arrow-left mkd-icon-element"></i></a></li>
                           }
                            {
                               paginationCount.map((item,key)=>{
                                   let class_name=(current_page==item) ? 'active_list':''
                                   return(
                                    <li className={class_name}><a href={"/shop/"+item}>{item}</a></li>
                                   
                                   )
                               })
                            }
                            {
                                current_page!=paginationCount.length && 
                                <li>
                                    <a href={"/shop/"+next_page}><i className="mkd-icon-linear-icon lnr lnr-arrow-right mkd-icon-element"></i></a>
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