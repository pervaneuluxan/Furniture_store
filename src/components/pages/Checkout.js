import React,{useState, useEffect } from 'react';
import { AppendStyle } from '../../utils/Append';
import PageTop1 from '../template/PageTop1';
import { sendFormData,getBasket } from '../../utils/Models';

export default function Checkout(){

    const [first_name, setFirst_name] = useState('');
    const [last_name, setLast_name] = useState('');
    const [company, setCompany] = useState('')
    const [country, setCountry] = useState('')
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [postCode, setPostCode] = useState('')
    const [showError, setShowError] = useState(false); 

    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);

    const l_storage=window.localStorage;
    const basket_key='basket';

    const checkBasket=l_storage.getItem('basket');

      useEffect(()=>{
        AppendStyle('checkout')
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
          
      },[])

      const sendProductDetails=(e)=>{
        // e.preventDefault(); 
        
        if(first_name &&last_name && email && phone && country && company && postCode){
            setShowError(false)
            sendFormData(
                {
                  order_product:true,
                  title:first_name+" "+last_name,
                  'meta[1]':email,
                  'meta[2]':phone,
                  'meta[3]':country,
                  'meta[4]':company,
                  'meta[5]':postCode
        
                }
            ).then((res)=>{
              setFirst_name('');
              setLast_name('');
              setEmail('');
              setPhone('');
              setCompany('');
              setCountry('');
              setPostCode('');
              alert('Mesajınız göndərildi')

              document.getElementById('order_form').reset();

            })
            

        }else{
            setShowError(true)
        }

        l_storage.removeItem(basket_key);
        window.location.reload();
      
    }

    const setState=(state_name, e)=>{

      state_name(e.target.value)

    }
    
    return(
        
     <>
       
      <PageTop1 id="7"/>

        <section className="customer_info full_width">
            <div className="center">
                <div className="customer_info_in full_width">
                    <div className="customer_login full_width flex justify_space_between">
                        <span>Returning customer?</span>
                        <button type="button" className="customer_toggle_btn login_show">Click here to login</button>
                    </div>
                        <form className="login_form full_width" id="toggle_text">
                            <p>If you have shopped with us before, please enter your details below. 
                                If you are a new customer,please proceed to the Billing & Shipping section.</p>
                           <ul className="login_form_list flex direction_column">
                               <li>
                                   <label for="username" className="input_lable">Username or email *</label>
                                   <input type="text" id="username" name="username" className="input_text" required/>
                               </li>
                               <li>
                                    <label for="password" className="input_lable">Password *</label>
                                    <input type="password" id="password" name="password" className="input_text" required/>
                                </li>
                                <li>
                                    <input type="checkbox" id="check" name="check"/>
                                    <label for="check" className="check_lable">Remember me</label>
                                    <button type="submit" className="login_btn">Login</button>
                                </li>
                                <li>
                                    <a href="">Lost your password?</a>
                                </li>
                           </ul>
                        </form>
                        <div className="customer_coupon full_width flex justify_space_between">
                            <span>Have a coupon?</span>
                            <button type="button" className="customer_toggle_btn coupon_show">Click here to enter your code</button>
                        </div>
                        <form className="coupon_form full_width" id="coupon_form">
                            <p>If you have a coupon code, please apply it below.</p>
                            <ul className="coupon_form_list full_width flex direction_column">
                                <li>
                                    <input type="text" id="coupon_code" name="coupon_code" className="input_text" placeholder="Coupon code"/>
                                </li>
                                <li>
                                    <button type="submit" className="apply_btn" name="apply_coupon" value="Apply coupon">Apply coupon</button>
                                </li>
                            </ul>
                        </form>
                </div>
            </div>
        </section>

        <section class="billing_details full_width">
            <div class="center">
                <div class="billing_details_in full_width">
                    <div class="billing_details_in_left full_width">
                        <h3>Billing details</h3>
                        <form class="billing_details_form full_width" id="order_form" onSubmit={sendProductDetails.bind(this)}>
                            <ul class="billing_details_form_list full_width flex direction_column">
                                <li class="flex full_width">
                                    <p>
                                        <label for="first_name">First name..*</label>
                                        <input type="text" id="first_name" name="first_name" class="input_text1" defaultValue={first_name} onKeyUp={setState.bind(this,setFirst_name)} />
                                    </p>
                                    <p class="second_p">
                                        <label for="last_name">Last name..*</label>
                                        <input type="text" id="last_name" name="last_name" class="input_text1" defaultValue={last_name} onKeyUp={setState.bind(this,setLast_name)} />
                                    </p>
                                </li>
                                <li>
                                    <label for="company_name">Company name (optional)</label>
                                    <input type="text" id="company_name" name="company_name" class="input_text" defaultValue={company} onKeyUp={setState.bind(this, setCompany)} />    
                                </li>
                                <li>
                                        <label for="last_name">Country..*</label>
                                        <select class="input_text" onChange={setState.bind(this,setCountry)}>
                                            <option value="az">Azerbaijan</option>
                                            <option value="en">England</option>
                                            <option value="ru">Russia</option>
                                        </select>
                                </li>
                                <li>
                                    <label for="street_address">Street address..*</label>
                                    <input type="text" id="street_address" name="street_address" class="input_text" placeholder="House number and street name"/>
                                </li>
                                <li>
                                    <input type="text" id="apartment" name="apartment" class="input_text" placeholder="Apartment, suite, unit etc. (optional)"/>
                                </li>
                                <li>
                                    <label for="town_city">Town / City..*</label>
                                    <input type="text" id="town_city" name="town_city" class="input_text" />
                                </li>  
                                <li>
                                    <label for="state_county">State / County..*</label>
                                    <input type="text" id="state_county" name="state_county" class="input_text"  />
                                </li>  
                                <li>
                                    <label for="postcode">Postcode / ZIP..*</label>
                                    <input type="text" id="postcode" name="postcode" class="input_text" defaultValue={postCode}  onKeyUp={setState.bind(this, setPostCode)}/>
                                </li>  
                                <li>
                                    <label for="phone">Phone ..*</label>
                                    <input type="text" id="phone" name="phone" class="input_text" defaultValue={phone}  onKeyUp={setState.bind(this, setPhone)}/>
                                </li>  
                                <li>
                                    <label for="email">Email address ..*</label>
                                    <input type="text" id="email" name="email" class="input_text" defaultValue={email} onKeyUp={setState.bind(this, setEmail)}/>
                                </li>
                                <li>
                                    <input type="checkbox" id="account_create_input" class="checkbox" />
                                    <label for="account_create_input" class="checkbox_lable">Create an account?</label>
                                    <p class="toggle_text">
                                        <label for="password">Create account password..*</label>
                                        <input type="password" id="password" class="password_input" placeholder="Password" required/>
                                    </p>
                                </li>
                            </ul>
                        </form>
                    </div>
                    
                    <div class="billing_details_in_right full_width">
                        <form class="address_change_form full_width flex direction_column">
                            <input type="checkbox" id="change_address" class="checkbox"/>
                            <label for="change_address" class="checkbox_lable">Ship to a different address?</label>
                            <ul class="address_change_form_list full_width flex direction_column">
                                    <li class="flex">
                                        <p>
                                            <label for="first_name">First name..*</label>
                                            <input type="text" id="first_name" name="first_name" class="input_text" required/>
                                        </p>
                                        <p class="second_p">
                                            <label for="last_name">Last name..*</label>
                                            <input type="text" id="last_name" name="last_name" class="input_text" required/>
                                        </p>
                                    </li>
                                    <li>
                                        <label for="company_name">Company name (optional)</label>
                                        <input type="text" id="company_name" name="company_name" class="input_text" required/>    
                                    </li>
                                    <li>
                                            <label for="last_name">Country..*</label>
                                            <select class="input_text">
                                                <option value="az">Azerbaijan</option>
                                                <option value="en">England</option>
                                                <option value="ru">Russia</option>
                                            </select>
                                    </li>
                                    <li>
                                        <label for="street_address">Street address..*</label>
                                        <input type="text" id="street_address" name="street_address" class="input_text" placeholder="House number and street name" required/>
                                    </li>
                                    <li>
                                        <input type="text" id="apartment" name="apartment" class="input_text" placeholder="Apartment, suite, unit etc. (optional)"/>
                                    </li>
                                    <li>
                                        <label for="town_city">Town / City..*</label>
                                        <input type="text" id="town_city" name="town_city" class="input_text"  required/>
                                    </li>  
                                    <li>
                                        <label for="state_county">State / County..*</label>
                                        <input type="text" id="state_county" name="state_county" class="input_text"  required/>
                                    </li>  
                                    <li>
                                        <label for="postcode">Postcode / ZIP..*</label>
                                        <input type="text" id="postcode" name="postcode" class="input_text"  required/>
                                    </li>  
                                </ul>
                                <label for="notes" class="notes_area_lable">Order notes (optional)</label>
                                <textarea class="input_text" id="notes" placeholder="Notes about your order, e.g. special notes for delivery."></textarea>
                        </form>
                    </div>
                </div>
            </div>
        </section>
        <section class="order_details full_width">
            <div class="center">
                <div class="order_details_in full_width">
                    <h3>Your order</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                         {
                             products && products.map((item,key)=>{
                                 return(
                                    <tr>
                                    <td>{item.title}<strong>× {item.qty}</strong></td>
                                    <td>${item.sum}</td>
                                </tr>
                                 )
                             })
                         }       
                    
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Subtotal</th>
                                <td>${total}</td>
                            </tr>
                            <tr>
                                <th>Shipping</th>
                                <td>
                                    <ul class="shipping_list flex direction_column" style={{'height':'75px'}}>
                                        <li>
                                            <input type="radio" name="shipping_method" checked id="free_shipping" />
                                            <label for="free_shipping">Free shipping</label>

                                        </li>
                                        <li>
                                            <input type="radio" name="shipping_method" id="local_pickup"/>
                                            <label for="local_pickup">Local pickup</label>
                                        </li>
                                        <li>
                                            <input type="radio" name="shipping_method" id="flat_rate"/>
                                            <label for="flat_rate">Flat Rate: <span> $10</span></label>
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <th>Total</th>
                                <td><strong>${total}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                    <div class="payment_methods">
                        <ul>
                            <li>
                                Sorry, it seems that there are no available payment methods 
                                for your state. Please contact us if you require assistance 
                                or wish to make alternate arrangements.
                            </li>
                        </ul>
                    </div>
                    <div class="privacy_policy">
                        <p>
                            Your personal data will be used to process your order, 
                            support your experience throughout this website, and for 
                            other purposes described in our <a href="#"> privacy policy</a>.
                           
                        </p>
                    </div>
                    <button type="submit" class="place_order_btn" form="order_form" onClick={sendProductDetails.bind(this)}>
                        Place order
                    </button>
                </div>
            </div>
        </section>

        
     </>
 

    )
}