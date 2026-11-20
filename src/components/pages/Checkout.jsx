import { useState, useEffect } from 'react';
import { AppendStyle } from '../../utils/Append';
import PageTop1 from '../template/PageTop1';
import { placeOrder, apiErrorMessage } from '../../utils/Models';
import { useGlobalContext } from '../../utils/CartContext';

const EMPTY_CUSTOMER = {
    firstName: '', lastName: '', company: '', country: 'Azerbaijan',
    email: '', phone: '', postCode: '',
};
const REQUIRED = ['firstName', 'lastName', 'country', 'email', 'phone', 'postCode'];

export default function Checkout(){
    const { cart: products, total, clearCart } = useGlobalContext();
    const [personInfo, setPersonInfo] = useState(EMPTY_CUSTOMER);
    const [showError, setShowError] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        AppendStyle('checkout');
    }, []);

    const sendProductDetails = (e) => {
        e.preventDefault();

        if (products.length === 0) {
            alert('Your cart is empty.');
            return;
        }
        if (REQUIRED.some((field) => !personInfo[field].trim())) {
            setShowError(true);
            return;
        }
        setShowError(false);
        setSubmitting(true);

        placeOrder(personInfo, products.map((item) => ({ productId: item.id, qty: Number(item.qty) })))
            .then((res) => {
                clearCart();
                setPersonInfo(EMPTY_CUSTOMER);
                alert(`Thank you! Order #${res.data.id} was placed. Total: $${res.data.total}`);
            })
            .catch((error) => alert(apiErrorMessage(error)))
            .finally(() => setSubmitting(false));
    };

    const handleChange = (e) => setPersonInfo({ ...personInfo, [e.target.name]: e.target.value });

    const fieldError = (field) =>
        showError && !personInfo[field].trim() && <span className="field_error">* This field must be filled</span>;

    return(
        
     <>
       
      <PageTop1 slug="checkout"/>

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
                                   <label htmlFor="username" className="input_lable">Username or email *</label>
                                   <input type="text" id="username" name="username" className="input_text" required/>
                               </li>
                               <li>
                                    <label htmlFor="password" className="input_lable">Password *</label>
                                    <input type="password" id="password" name="password" className="input_text" required/>
                                </li>
                                <li>
                                    <input type="checkbox" id="check" name="check"/>
                                    <label htmlFor="check" className="check_lable">Remember me</label>
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

        <section className="billing_details full_width">
            <div className="center">
                <div className="billing_details_in full_width">
                    <div className="billing_details_in_left full_width">
                        <h3>Billing details</h3>
                        <form className="billing_details_form full_width" id="order_form" onSubmit={sendProductDetails}>
                            <ul className="billing_details_form_list full_width flex direction_column">
                                <li className="flex full_width">
                                    <p>
                                        <label htmlFor="first_name">First name..*</label>
                                        <input type="text" id="first_name" name="firstName" className="input_text1" value={personInfo.firstName} onChange={handleChange} />
                                        {fieldError('firstName')}
                                    </p>
                                    <p className="second_p">
                                        <label htmlFor="last_name">Last name..*</label>
                                        <input type="text" id="last_name" name="lastName" className="input_text1" value={personInfo.lastName} onChange={handleChange} />
                                        {fieldError('lastName')}
                                    </p>
                                </li>
                                <li>
                                    <label htmlFor="company_name">Company name (optional)</label>
                                    <input type="text" id="company_name" name="company" className="input_text" value={personInfo.company} onChange={handleChange} />    
                                </li>
                                <li>
                                        <label htmlFor="last_name">Country..*</label>
                                        <select className="input_text" name="country" value={personInfo.country} onChange={handleChange}>
                                            <option value="Azerbaijan">Azerbaijan</option>
                                            <option value="England">England</option>
                                            <option value="Russia">Russia</option>
                                        </select>
                                </li>
                                <li>
                                    <label htmlFor="street_address">Street address..*</label>
                                    <input type="text" id="street_address" name="street_address" className="input_text" placeholder="House number and street name"/>
                                </li>
                                <li>
                                    <input type="text" id="apartment" name="apartment" className="input_text" placeholder="Apartment, suite, unit etc. (optional)"/>
                                </li>
                                <li>
                                    <label htmlFor="town_city">Town / City..*</label>
                                    <input type="text" id="town_city" name="town_city" className="input_text" />
                                </li>  
                                <li>
                                    <label htmlFor="state_county">State / County..*</label>
                                    <input type="text" id="state_county" name="state_county" className="input_text"  />
                                </li>  
                                <li>
                                    <label htmlFor="postcode">Postcode / ZIP..*</label>
                                    <input type="text" id="postcode" name="postCode" className="input_text" value={personInfo.postCode} onChange={handleChange}/>
                                    {fieldError('postCode')}
                                </li>  
                                <li>
                                    <label htmlFor="phone">Phone ..*</label>
                                    <input type="text" id="phone" name="phone" className="input_text" value={personInfo.phone} onChange={handleChange}/>
                                    {fieldError('phone')}
                                </li>  
                                <li>
                                    <label htmlFor="email">Email address ..*</label>
                                    <input type="email" id="email" name="email" className="input_text" value={personInfo.email} onChange={handleChange}/>
                                    {fieldError('email')}
                                </li>
                                <li>
                                    <input type="checkbox" id="account_create_input" className="checkbox" />
                                    <label htmlFor="account_create_input" className="checkbox_lable">Create an account?</label>
                                    <p className="toggle_text">
                                        <label htmlFor="password">Create account password..*</label>
                                        <input type="password" id="account_password" className="password_input" placeholder="Password"/>
                                    </p>
                                </li>
                            </ul>
                        </form>
                    </div>
                    
                    <div className="billing_details_in_right full_width">
                        <form className="address_change_form full_width flex direction_column">
                            <input type="checkbox" id="change_address" className="checkbox"/>
                            <label htmlFor="change_address" className="checkbox_lable">Ship to a different address?</label>
                            <ul className="address_change_form_list full_width flex direction_column">
                                    <li className="flex">
                                        <p>
                                            <label htmlFor="first_name">First name..*</label>
                                            <input type="text" id="first_name" name="first_name" className="input_text" required/>
                                        </p>
                                        <p className="second_p">
                                            <label htmlFor="last_name">Last name..*</label>
                                            <input type="text" id="last_name" name="last_name" className="input_text" required/>
                                        </p>
                                    </li>
                                    <li>
                                        <label htmlFor="company_name">Company name (optional)</label>
                                        <input type="text" id="company_name" name="company_name" className="input_text" required/>    
                                    </li>
                                    <li>
                                            <label htmlFor="last_name">Country..*</label>
                                            <select className="input_text">
                                                <option value="az">Azerbaijan</option>
                                                <option value="en">England</option>
                                                <option value="ru">Russia</option>
                                            </select>
                                    </li>
                                    <li>
                                        <label htmlFor="street_address">Street address..*</label>
                                        <input type="text" id="street_address" name="street_address" className="input_text" placeholder="House number and street name" required/>
                                    </li>
                                    <li>
                                        <input type="text" id="apartment" name="apartment" className="input_text" placeholder="Apartment, suite, unit etc. (optional)"/>
                                    </li>
                                    <li>
                                        <label htmlFor="town_city">Town / City..*</label>
                                        <input type="text" id="town_city" name="town_city" className="input_text"  required/>
                                    </li>  
                                    <li>
                                        <label htmlFor="state_county">State / County..*</label>
                                        <input type="text" id="state_county" name="state_county" className="input_text"  required/>
                                    </li>  
                                    <li>
                                        <label htmlFor="postcode">Postcode / ZIP..*</label>
                                        <input type="text" id="postcode" name="postcode" className="input_text"  required/>
                                    </li>  
                                </ul>
                                <label htmlFor="notes" className="notes_area_lable">Order notes (optional)</label>
                                <textarea className="input_text" id="notes" placeholder="Notes about your order, e.g. special notes for delivery."></textarea>
                        </form>
                    </div>
                </div>
            </div>
        </section>
        <section className="order_details full_width">
            <div className="center">
                <div className="order_details_in full_width">
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
                                    <tr key={item.id}>
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
                                    <ul className="shipping_list flex direction_column" style={{'height':'75px'}}>
                                        <li>
                                            <input type="radio" name="shipping_method" defaultChecked id="free_shipping" />
                                            <label htmlFor="free_shipping">Free shipping</label>

                                        </li>
                                        <li>
                                            <input type="radio" name="shipping_method" id="local_pickup"/>
                                            <label htmlFor="local_pickup">Local pickup</label>
                                        </li>
                                        <li>
                                            <input type="radio" name="shipping_method" id="flat_rate"/>
                                            <label htmlFor="flat_rate">Flat Rate: <span> $10</span></label>
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
                    <div className="payment_methods">
                        <ul>
                            <li>
                                Sorry, it seems that there are no available payment methods 
                                for your state. Please contact us if you require assistance 
                                or wish to make alternate arrangements.
                            </li>
                        </ul>
                    </div>
                    <div className="privacy_policy">
                        <p>
                            Your personal data will be used to process your order, 
                            support your experience throughout this website, and for 
                            other purposes described in our <a href="#"> privacy policy</a>.
                           
                        </p>
                    </div>
                    <button type="submit" className="place_order_btn" form="order_form" disabled={submitting}>
                        {submitting ? 'Placing order…' : 'Place order'}
                    </button>
                </div>
            </div>
        </section>

        
     </>
 

    )
}