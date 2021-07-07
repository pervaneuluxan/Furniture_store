import React,{useState, useEffect, useContext } from 'react';
import { AppendStyle } from '../../utils/Append';
import PageTop1 from '../template/PageTop1';
import { getBasket, getPostById } from '../../utils/Models';
import { TranslateList } from '../../App';


export default function Cart(){
    
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [emptyCart, setEmptyCart] = useState('')
    const [updateBasket, setUpdateBasket] = useState(false)
    const l_storage=window.localStorage;
    const basket_key='basket';

    const checkBasket=l_storage.getItem('basket');

    const tr_list=useContext(TranslateList);

 

    useEffect(()=>{

        AppendStyle('cart')

        getPostById(89).then((res)=>{
            let data=res.data;

            setEmptyCart(data);
        })

      
        
        if(checkBasket){
           const cart_data=JSON.parse(checkBasket);
           const ids=Object.keys(cart_data).join(',');
           
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
                 
               let qty=cart_data[row.id];
   
       
               let sum=(has_discount) ? qty *calc_discount :qty *price;
                 
               setTotal(prevState=>prevState+sum);
   
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
                       qty:qty,
                       sum:sum,
                       stock:row.metas.stock
                   })
                  
               }
             setProducts(products);
            })
           } else{
              setProducts([]);
           }
        }
         
    
    },[updateBasket])
      
    const updateItemCount=(product_id, e)=>{
        console.log(e, e.target.value)

        const old_data=JSON.parse(l_storage.getItem(basket_key));
           
           
        old_data[product_id]=e.target.value;

        l_storage.setItem(basket_key,JSON.stringify(old_data));
         
        setTotal(0);
        setUpdateBasket(Math.random());
    }
    const removeItem=(product_id, e)=>{
        if(window.confirm("Are you sure delete this?")){
            console.log(e, e.target.value)

            const old_data=JSON.parse(l_storage.getItem(basket_key));
               
               
            delete old_data[product_id];
    
            l_storage.setItem(basket_key,JSON.stringify(old_data));
             
            setTotal(0);
            setUpdateBasket(Math.random());
        }
    }

    return(
        
     <>
       
     <PageTop1 id="5"/>
     
        <section className="cart full_width">
            <div className="center">
                <div className="cart_in full_width flex">
                    {
                        (products.length > 0) ?<><div className="full_cart full_width flex">
                        <div className="cart_in_left " >
                            <h3>Shopping Cart</h3>
                            <table className="cart_table">

                                <tbody>
                                    
                         {   
                             
                             products && products.map((item,key)=>{
                               
                                  
                                
                                 
                                 return(
                                        <tr className="cart_item">
                                        <td className="cart_remove" nowrap="nowrap"><button type="button" onClick={removeItem.bind(this, item.id)}>×</button></td>
                                        <td className="product_image"><a href={"/shop_item/"+item.link}><img
                                                    src={item.featured} alt={item.title} /></a></td>
                                        <td className="product_name"><a href="#">{item.title}</a></td>
                                        <td className="product_price"> 
                                         
                                         {
                                         item.has_discount ? <>
                                                    <span class="old_price"><del>${item.price}</del></span>
                                                    <span class="new_price">${item.discount_price}</span>   
                                                </> :<span class="new_price">${item.price}</span>
                                          
                                         }
                                         </td>
                                        <td className="product_qty">
                                            <div className="quantity_buttons flex">
                                            <span className="quantity_lable">Quantity</span>
                                                  
                                           <input type="number" min="1" max={item.stock} defaultValue={item.qty} onChange={updateItemCount.bind(this, item.id)}  className="qty_input" />
                                            </div>
                                        </td>
                                        <td className="product_subtotal">
                                            <span className="subtotal">${item.sum}</span>
                                        </td>
                                    </tr>
                                    )
                             })
                         }
                                    <tr className="cart_bottom full_width">
                                        <td className="full_width flex justify_space_between">
                                            <div className="coupon flex justify_space_between">
                                                <label for="cupon_code"></label>
                                                <input type="text" name="cupon_code" id="cupon_code"
                                                    placeholder="Coupon code" />
                                                <button type="submit" className="coupon_btn" name="apply_coupon">Apply
                                                    coupon</button>
                                            </div>
                                            <div className="update flex justify_center">
                                                <button type="submit" className="update_btn" name="update_btn">Update
                                                    cart</button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <a className="back_shopping" href="shop.html"><i
                                    className="mkd-icon-linear-icon lnr lnr-arrow-left"></i>Go back shopping</a>
                        </div>
                        <div className="cart_in_right">
                            <h3>Cart Totals</h3>
                            <table>
                                <tbody className="full_width">
                                    <tr className="subtotal_row">
                                        <th>Subtotal</th>
                                        <td><span>${total}</span></td>
                                    </tr>
                                    <tr className="shipping_row">
                                        <th>Shipping</th>
                                        <td>
                                            <ul>
                                                <li>
                                                    <input type="radio" name="shipping_method" id="free_shipping" checked />
                                                    <label for="free_shipping">Free shipping</label>

                                                </li>
                                                <li>
                                                    <input type="radio" name="shipping_method" id="local_pickup" />
                                                    <label for="local_pickup">Local pickup</label>
                                                </li>
                                                <li>
                                                    <input type="radio" name="shipping_method" id="flat_rate" />
                                                    <label for="flat_rate">Flat Rate: <span> $10</span></label>
                                                </li>
                                            </ul>
                                            <p>Shipping to
                                                <strong>Azerbaijan</strong>
                                            </p>
                                            <form className="address_form">
                                                <button type="button" className="change_btn">Change address</button>
                                                <div className="shipping_info" style={{'display':'none'}}>
                                                    <ul >
                                                        <li>
                                                            <select>
                                                                <option value="Az">Azerbaijan</option>
                                                                <option value="En">England</option>
                                                                <option value="Ru">Russia</option>
                                                            </select>
                                                        </li>
                                                        <li>
                                                            <input type="text" className="input_text"
                                                                placeholder="Town / City" />
                                                        </li>
                                                        <li>
                                                            <input type="text" className="input_text"
                                                                placeholder="Postcode / ZIP" />
                                                        </li>
                                                        <li>
                                                            <button type="submit" className="address_update_btn">Update</button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </form>
                                        </td>
                                    </tr>
                                    <tr className="full_width total_cart flex justify_space_between align_center ">
                                        <th>Total</th>
                                        <td><strong><span>${total}</span></strong></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="checkout">
                              <a href="/checkout">Proceed to checkout</a>
                            </div>
                        </div>
                </div>
                </>:
                <div className="empty_cart">
                        <p className="empty_cart_title">{emptyCart.title}</p>
                        <p className="empty_cart_text">
                            {emptyCart.content}
                        </p>
                        <a href="/shop">{tr_list.return_to_shop}</a>
                    </div>  
                    }
                 
                        
                </div>
            </div>
        </section>


     </>
 

    )
}