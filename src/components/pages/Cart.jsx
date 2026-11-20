import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { AppendStyle } from '../../utils/Append';
import PageTop1 from '../template/PageTop1';
import {getPage } from '../../utils/Models';
import { useGlobalContext } from '../../utils/CartContext';


export default function Cart(){

    const {translate,cart,removeItem,updateItemCount,total}=useGlobalContext();
    const [emptyCart, setEmptyCart] = useState('');
    console.log('cart',cart);

    useEffect(()=>{

        AppendStyle('cart')

        getPage('empty-cart').then((res)=>{
            let data=res.data;

            setEmptyCart(data);
        })

    
    },[cart])
      
    

    return(
        
     <>
       
     <PageTop1 slug="cart"/>
     
        <section className="cart full_width">
            <div className="center">
                <div className="cart_in full_width flex">
                    {
                        (cart.length > 0) ?<><div className="full_cart full_width flex">
                        <div className="cart_in_left " >
                            <h3>Shopping Cart</h3>
                            <table className="cart_table">

                                <tbody>
                                    
                         {   
                             
                             cart && cart.map((item,index)=>{
                               
                                  
                                
                                 
                                 return(
                                        <tr className="cart_item" key={item.id} >
                                        <td className="cart_remove" style={{ whiteSpace: 'nowrap' }}><button type="button" onClick={() => removeItem(item.id)}>×</button></td>
                                        <td className="product_image"><Link to={"/shop_item/"+item.link}><img
                                                    src={item.featured} alt={item.title} /></Link></td>
                                        <td className="product_name"><Link to={"/shop_item/"+item.link}>{item.title}</Link></td>
                                        <td className="product_price"> 
                                         
                                         {
                                         item.has_discount ? <>
                                                    <span className="old_price"><del>${item.price}</del></span>
                                                    <span className="new_price">${item.discount_price}</span>   
                                                </> :<span className="new_price">${item.price}</span>
                                          
                                         }
                                         </td>
                                        <td className="product_qty">
                                            <div className="quantity_buttons flex">
                                            <span className="quantity_lable">Quantity</span>
                                                  
                                           <input type="number" min="1" max={item.stock} value={item.qty} onChange={(e) => updateItemCount(item.id, e)}  className="qty_input" />
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
                                                <label htmlFor="cupon_code"></label>
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
                            <Link className="back_shopping" to="/shop"><i
                                    className="mkd-icon-linear-icon lnr lnr-arrow-left"></i>Go back shopping</Link>
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
                                                    <input type="radio" name="shipping_method" id="free_shipping" defaultChecked />
                                                    <label htmlFor="free_shipping">Free shipping</label>

                                                </li>
                                                <li>
                                                    <input type="radio" name="shipping_method" id="local_pickup" />
                                                    <label htmlFor="local_pickup">Local pickup</label>
                                                </li>
                                                <li>
                                                    <input type="radio" name="shipping_method" id="flat_rate" />
                                                    <label htmlFor="flat_rate">Flat Rate: <span> $10</span></label>
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
                        <a href="/shop">{translate.return_to_shop}</a>
                    </div>  
                    }
                 
                        
                </div>
            </div>
        </section>


     </>
 

    )
}