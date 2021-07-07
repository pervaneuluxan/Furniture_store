import React,{useState, useEffect} from "react";
import { getPostById } from "../../utils/Models";

 function PageBanner(props){
    const[title, setTitle] = useState('');

    useEffect(async()=>{

        getPostById(props.id).then((res)=>{
            let data=res.data

            setTitle(data.title);
           
        })
    },[])


    return(
        <section className="shop_banner full_width">
        <div className="center">

            <ul className="flex align_center">
                <li><a href="/">Home</a></li>
                <li><span>/</span></li>
                <li><span>{title}</span></li>
            </ul>
        </div>

    </section>
    )

}
export default PageBanner;