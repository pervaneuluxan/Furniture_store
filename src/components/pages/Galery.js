import React,{useState, useEffect } from 'react';
import { AppendStyle } from '../../utils/Append';
import { getPostsByType } from '../../utils/Models';
import PageTop3 from '../template/PageTop3';

export default function Galery(){

    const [galeryPost, setGaleryPost] = useState([])
      useEffect(()=>{
       AppendStyle('galery')
       getPostsByType(21).then((res)=>{
           let res_data=res.data

           console.log(res_data);
           
           const galery=[];
           for(let index in res_data.data){
               let row=res_data.data[index];

               galery.push({
                   featured:row.featured,
                   title:row.title
               })
           }
           setGaleryPost(galery);

       })

      },[])

    return(
        
     <>
       <PageTop3 id="9"/>
     

        <section className="gallery full_width">
            <div className="center">
                <div className="gallery_in full_width">
            
                        <ul className="gallery_list">
                            
                        {
                            galeryPost && galeryPost.map((item,key)=>{
                                return(
                                    <li>
                                        <img src={item.featured} alt={item.title} />
                                        <span className="overlay"></span>
                                    </li>
                                )
                            })
                        }
                           
                            
                            
                        </ul>
                </div>
            </div>
        </section>

     </>
 

    )
}