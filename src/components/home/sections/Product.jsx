
import React,{useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import { getPostsByType } from '../../../utils/Models';

export default function Product(props){
    
const [products, setProducts] = useState([]);

useEffect(()=>{
   getPostsByType('product').then((res)=>{
       let res_data=res.data

       const products=[];
       for(let index in res_data.data){
           let row=res_data.data[index];
       
       const { price, discount_price: calc_discount, has_discount } = row;
    

           products.push({
            id:row.id,
            title:row.title,
            featured:row.featured,
            has_discount:has_discount,
            price:price,
            link:row.slug,
            discount_price:calc_discount
               
           })
       }
       setProducts(products);
   })
},[])
    return(
    <>
         <section className="product full_width">
            <div className="center">
                <div className="product_in full_width">
                    <ul className="home_product_list">
                        
                      {
                          products && products.map((item,key)=>{
                              return(
                                <li key={key}>
                                <img src={item.featured} alt={item.title} />
                               <span className="overlay">
                               <NavLink to={"/shop_item/"+item.link}> <h5>{item.title}</h5></NavLink>
                                        <span className="rating_icon">
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                        </span>
                                        {
                                            item.has_discount ? <>
                                                <span className="old_price"><del>${item.price}</del></span>
                                                <span className="new_price">${item.discount_price}</span>   
                                            </> :<span className="new_price">${item.price}</span>
          
                                         }
                                    </span>
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