import React,{useState, useEffect } from 'react';
import { getPostsByType } from '../../../utils/Models';
import {AppendScript} from "../../../utils/Append"

export default function Slider(){

   const [posts, setPosts] = useState([]);
   
   
   useEffect(() => {

   

   getPostsByType(7).then((res)=> {

        const res_data=res.data

        const posts=[];
      
        for(let index in res_data.data){
            let row=res_data.data[index];
      
            posts.push({
                title:row.title,
                featured:row.featured,
                excerpt:row.excerpt,
            })
        }
      setPosts(posts);
      

    })
    
    
  
}, [])
   
    return(
        <>
         <section className="slider full_width">
            <div className="center full_height">
                <div className="slider_in  full_width full_height single-item">

                   {
                       posts.map((item,key)=>{
                           return(
                            <div key={key} className="slider_item">
                            <div className="slider_text">
                                <h3>{item.title}</h3>
                                <p>
                                    {item.excerpt}
                                </p>
                            </div>
                            <img src={item.featured} alt="slider"/>
                        </div>
                           )
                       })
                   }

                </div>
                </div>
                
            
        </section>
        </>
    )
}