import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { AppendScript, AppendStyle } from '../../utils/Append';
import { getMenu } from '../../utils/Models';

export default function Footer(){

    const [menus, setMenus] = useState([]);

    useEffect(()=>{
        AppendStyle('responsive');
        AppendScript('main');
        AppendScript('index');

        getMenu('footer')
            .then((res) => setMenus(res.data))
            .catch(() => setMenus([]));
    },[]);

    return(
        
        <footer className="footer full_width flex direction_column">
            <div className="center">
                <div className="footer_in full_width">
                    <ul className="footer_menu_list full_width flex justify_space_between">
                        {
                            menus.map((item) => (
                                <li key={item.id}>
                                    <h4>{item.title}</h4>
                                    {item.subs.map((sub) => (
                                        <Link key={sub.id} to={sub.link || '/'}>{sub.title}</Link>
                                    ))}
                                </li>
                            ))
                        }
                    </ul>

                </div>
            </div>
            <div className="line"></div>
            <div className=" footer_bottom center flex justify_space_between align_center">
                <p>© 2021 Qode Interactive, All Rights Reserved</p>

                <ul className="footer_social_links flex align_center">
                    <li><span>Follow us</span></li>
                    <li><a href="#"><i className="fab fa-twitter"></i></a></li>
                    <li><a href="#"><i className="fab fa-instagram"></i></a></li>
                    <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>


                </ul>
            </div>
         
            <button type="button" className="back_to_top"><i className="mkd-icon-font-awesome fa fa-angle-up "></i></button>
    </footer>

    )
}