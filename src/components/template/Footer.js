import React,{useState, useEffect } from 'react';
import { AppendScript, AppendStyle } from '../../utils/Append';
import { getMenusByType } from '../../utils/Models';

export default function Footer(){

    const [menus, setMenus] = useState([]);
    const [menuSubs, setMenuSubs] = useState([])
    
    
    useEffect(()=>{
        

        AppendStyle('responsive');
        AppendScript('main');
        AppendScript('index')
        
    
        getMenusByType(2).then((res)=>{
            let res_data=res.data;

           
         
            const menus=[];

            for(let index in res_data){
                let row=res_data[index];
               

                menus.push({
                    title:row.title
            
                }) 
                setMenus(menus);

                const subs=[];

                for(let index in row.subs){
                    let sub_row=row.subs[index]

  
                    subs.push({
                      subTitle:sub_row.title
                    })

                  
                    setMenuSubs([...subs]);
                }
              
             
            }
        
             
        
           
      
        })
        getMenusByType(1).then((res)=>{
   
        })

      },[])
  
    return(
        
        <footer className="footer full_width flex direction_column">
            <div className="center">
                <div className="footer_in full_width">
                    <ul className="footer_menu_list full_width flex justify_space_between">
                        {
                            menus && menus.map((item,key)=>{
                                return(
                                    <li key={key}><h4>{item.title}</h4>
                                    {
                                    menuSubs && menuSubs.map((submenu,key)=>{
                                        return(
                                            <a key={key} href="">{submenu.subTitle}</a>
                                        )
                                    })
                                    }
                                     
                                    
                                    </li>

                                )
                            })
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