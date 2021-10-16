import { useState, useEffect, useRef } from 'react';
import { getBasket, getMenusByType } from '../../utils/Models';
import { useGlobalContext } from '../../utils/CartContext';
import {NavLink} from 'react-router-dom';

export default function Header() {
    const {cart,total,removeItem}=useGlobalContext();

    const [menus, setMenus] = useState([]);
    const [wishListTotal, setWishListTotal] = useState(0)
    const lang_menu = useRef();
  
    const l_storage = window.localStorage,
        check_lang = l_storage.getItem('default_lang');

    const wishlist_key = 'wishlist',
       
        checkWishlist = l_storage.getItem('wishlist');
       
    
    useEffect(() => {

        getMenusByType(1).then((res) => {

            const res_data = res.data;
            const menus = [];

            for (let index in res_data) {
                let row = res_data[index];

                menus.push({
                    content: row.content,
                    title: row.title
                })
            }
            setMenus(menus);


        })


        if (!Boolean(check_lang)) {
            l_storage.setItem('default_lang', 'az')
        }

        lang_menu.current.addEventListener('change', function (e) {

            l_storage.setItem('default_lang', e.target.value)

            window.location.href = window.location.href;
        })



        if (checkWishlist) {
            const wishlist_data = JSON.parse(checkWishlist);
            const ids = Object.keys(wishlist_data).join(',');


            if (ids.length > 0) {
                getBasket(ids).then((res) => {

                    let res_data = res.data;
                    setWishListTotal(res_data.total)

                })
            }
        }
       

    }, [cart])

  
    return (

        <header className="header full_width flex align_center">
            <div className="center full_height">
                <div className="header_in flex full_width full_height justify_space_between align_center">

                    <a href="/" className="logo_link flex">DEPOT</a>

                    <nav className="desktop_nav full_height">
                        <ul className="main_nav_menu full_height ">
                            {
                                menus.map((item,key) => {
                                    return (
                                        <li key={key} className="navbar_item">
                                            <NavLink to={item.content} exact activeClassName="active_link">{item.title}</NavLink>
                                        </li>
                                    )
                                })
                            }


                        </ul>
                    </nav>

                    <div className="desktop_right_side full_height">

                        <ul className="desktop_right_list full_height">
                            <li className="cart">
                                <NavLink to="/cart" activeClassName="active_link">Cart<span>(${total})</span></NavLink>
                                <ul className="cart_dropdown flex align_center direction_column">
                                    {
                                        (cart.length > 0) ? <>
                                            {
                                                cart.map((item, key) => {
                                                    return (
                                                        <li key={key}>
                                                            <NavLink to={"/shop_item/"+item.link}><img src={item.featured} className="product_img" /></NavLink>
                                                            <div className="cart_dropdown_product_info">

                                                                <h5 className="product_title"><NavLink to={"/shop_item/"+item.link}>{item.title}</NavLink></h5>
                                                                <span className="product_qty">{item.qty} X</span>
                                                                <span className="product_price">${item.sum}</span>
                                                            </div>
                                                            <button type="button" className="product_remove_btn" onClick={removeItem.bind(this,item.id)}>×</button>
                                                        </li>
                                                    )
                                                })
                                            }
                                            <li className="cart_total cart_dropdwon_bottom_list flex justify_space_between">
                                                <span>Total :</span>
                                                <span>${total}</span>
                                            </li>
                                            <li className="cart_dropdwon_bottom_list view_cart">
                                                <a href="/cart ">View Cart</a>
                                            </li>
                                            <li className="cart_dropdwon_bottom_list checkout" >
                                                <a href="/checkout">Checkout</a>
                                            </li></> :
                                            <li className="empty_cart">No products in the cart.</li>
                                    }


                                </ul>
                            </li>
                            <li className="fav_link">
                                <NavLink to="/wishlist" activeClassName="active_link"><i className="far fa-heart"></i><span>({wishListTotal})</span></NavLink>
                            </li>
                            <li>
                                <button type="button" className="login_open_btn"><i className="far fa-user"></i><span>Login</span></button>
                            </li>
                            <li>
                                <select className="lang_menu" ref={lang_menu}>
                                    <option value="az" selected={(check_lang === 'az') ? true : false}>Az</option>
                                    <option value="en" selected={(check_lang === 'en') ? true : false}>En</option>
                                </select>
                            </li>

                        </ul>
                        <div className="login_main full_width" id="login_main">
                            <div className="login_box" id="login_box">
                            
                                <div>
                                    <button type="button" className="login_open_btn login_active">LOGIN</button>
                                    <button type="button" className="register_open_btn register_active">REGISTER</button>
                                </div>
                                <form action="" method="">
                                    <ul>
                                        <li>
                                            <input type="text" id="username" name="user" className="form_input "

                                                placeholder="Username" />
                                        </li>
                                        <li>
                                            <input type="password" name="pass" className="form_input" autoComplete="off"
                                                placeholder="Password" />
                                        </li>
                                        <li>
                                            <input type="checkbox" id="check_input" name="check_input" className="check_input" />
                                            <label htmlFor="check_input">Remember me</label>
                                        </li>
                                        <li>
                                            <a href="#">Lost your password?</a>
                                        </li>
                                        <li>
                                            <input type="submit" id="submit_input" className="submit_input" value="LOGIN" />
                                        </li>

                                    </ul>
                                </form>
                            </div>
                        </div>
                        <div className="register_main full_width" id="register_main">
                            <div className="register_box" id="register_box">
                                <div>
                                <button type="button" className="login_open_btn login_active">LOGIN</button>
                                    <button type="button" className="register_open_btn register_active">REGISTER</button>
                                </div>
                                <form action="" method="">
                                    <ul>
                                        <li>
                                            <input type="text" name="user" className="form_input"
                                                placeholder="Username" />
                                        </li>
                                        <li>
                                            <input type="email" name="my_email" className="form_input"
                                                placeholder="Email" />
                                        </li>
                                        <li>
                                            <input type="password" name="pass" className="form_input" autoComplete="off"
                                                placeholder="Password" />
                                        </li>
                                        <li>
                                            <input type="password" name="pass" className="form_input" autoComplete="off"
                                                placeholder="Repeat Password" />
                                        </li>

                                        <li>
                                            <input type="submit" className="submit_input" value="REGISTER" />
                                        </li>

                                    </ul>
                                </form>
                            </div>
                        </div>
                    </div>


                    <button type="button" className="mobile_nav_btn">Menu<i className="fa fa-bars"></i></button>
                </div>
            </div>
            <div className="nav_mobile_box full_width">
                <div className="nav_mobile_box_in full_width full_height">
                    <button type="button" className="nav_mobile_close_btn"><i className="fas fa-times"></i></button>
                    <div className="nav_mobile_in header_menu full_width full_height flex direction_column">
                        <ul className="mobile_nav_list full_width flex direction_column">
                          {
                              menus.map((item,key)=>{
                                  return(
                                <li key={key} className="navbar_item">
                                    <NavLink to={item.content} exact activeClassName="active_link">{item.title}</NavLink>
                                </li>
                                  )
                              })
                          }
                        </ul>

                    </div>
                </div>
            </div>
        </header>

    )
}