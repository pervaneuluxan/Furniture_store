import React,{useState, useEffect } from 'react';
import { getPostsByType } from '../../../utils/Models';

export default function Partners(){
    const [posts, setPosts] = useState([]);

    useEffect(() => {
    getPostsByType(17).then((res)=> {
  
         const res_data=res.data

         console.log(res_data)
 
         const posts=[];
       
         for(let index in res_data.data){
             let row=res_data.data[index];
       
             posts.push({
                 featured:row.featured,
             })
         }
       setPosts(posts);
       
 
     })
     
     
   
 }, [])
    return(
        <>
            <section className="partners full_width">
            <div className="center">
                <h3>Our Partners</h3>
               {
                   posts &&  <ul className="partners-list flex justify_space_between owl-carousel">
                         {
                             posts.map((item,key)=>{
                                 return(
                                    <li key={key}><img src={item.featured} alt="partner_photo"/></li>
                                 )
                             })
                         }
                   </ul>
               }
            
            </div>
        </section>
        </>
    )
}