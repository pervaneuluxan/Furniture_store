import React,{useState, useEffect, useContext } from 'react';
import { AppendStyle } from '../../utils/Append';
import PageTop1 from '../template/PageTop1';
import { getBasket,addBasket } from '../../utils/Models';
import { TranslateList } from '../../App';


export default function Whislist(){

    const tr_list=useContext(TranslateList);
    
    const [products, setProducts] = useState([])
    const [updateWishlist, setUpdateWishlist] = useState(false);
    const l_storage=window.localStorage;
    const wishlist_key='wishlist';
    const basket_key='basket';

    const checkWishlist=l_storage.getItem('wishlist');
      useEffect(()=>{
         AppendStyle('wishlist')

         if(checkWishlist){
            const wishlist_data=JSON.parse(checkWishlist);
            const ids=Object.keys(wishlist_data).join(',');
            
            if(ids.length > 0){

                getBasket(ids).then((res)=>{

                    let res_data=res.data;
       
                   const products=[];
                   for(let index in res_data.data){
                       let row=res_data.data[index];
                      
                       let discount=row.metas.discount,
                       price=row.metas.price,
                       discount_start_date = new Date(row.metas.discount_start_date),
                       discount_end_date = new Date(row.metas.discount_end_date),
                       now_date=new Date(),
                       calc_discount=(price * (100 - discount)) / 100;
                     
                      
                   let has_discount=(discount_start_date <= now_date && discount_end_date >= now_date) ? true:false;
       
                   products.push({
                           id:row.id,
                           title:row.title,
                           featured:row.featured,
                           excerpt:row.excerpt,
                           metas:row.metas,
                           link:row.slug,
                           date:row.date,
                           has_discount:has_discount,
                           price:price,
                           discount_price:calc_discount,
                           stock:row.metas.stock
                       })
                      
                   }
                 setProducts(products);
                })
               } else{
                  setProducts([]);
               }
            }
             
        
        },[updateWishlist])

   

        const removeItem=(product_id, e)=>{
            if(window.confirm("Are you sure delete this?")){
                console.log(e, e.target.value)
    
                const old_data=JSON.parse(l_storage.getItem(wishlist_key));
                   
                   
                delete old_data[product_id];
        
                l_storage.setItem(wishlist_key,JSON.stringify(old_data));
                 
                setUpdateWishlist(Math.random());
        
            }
            window.location.href=window.location.href
            window.document.getElementsByTagName('body').style.backgroundColor="255,255,255,0.7"
        }
    

    return(
        
     <>
       
     <PageTop1 id="6"/>

       <section className="wishlist full_width">
           <div className="center">
               <div className="wishlist_in full_width">
                   {
                       (products.length >0) ? <>  <table className=" whishlist_table full_width">
                       <tbody>
                        {
                            products.map((item,key)=>{
                                return(
                                    <tr className="whishlist_item full_width">
                                        <td className="product_remove"><button type="button" onClick={removeItem.bind(this,item.id)} className="prd_remove">×</button></td>
                                        <td className="product_img"><a href={"/shop_item/"+item.link}><img src={item.featured} alt={item.title}/></a></td>
                                        <td className="product_name"><a href={"/shop_item/"+item.link}>{item.title}</a></td>
                                        <td className="product_price"> 
                                        {
                                         item.has_discount ? <>
                                                    <span class="old_price"><del>${item.price}</del></span>
                                                    <span class="new_price">${item.discount_price}</span>   
                                                </> :<span class="new_price">${item.price}</span>
                                          
                                         }
                                        </td>
                                        <td className="product_stock_status">{
                                        (item.stock > 3) ?<span>In stock</span>:<span>Sold out</span>
                                        }</td>
                                        <td className="product_add_to_cart"><button type="button" onClick={addBasket.bind(this ,item.id,1)}>{tr_list.add_to_cart}</button></td>
                                    </tr>
                                )
                            })
                        }
                       </tbody>
                   </table></>:<div className="empty_wishlist full_width">
                       No products were added to the wishlist	
                   </div>
                 
                   }
                 
               </div>
           </div>
       </section>


     </>
 

    )
}