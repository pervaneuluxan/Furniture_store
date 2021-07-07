import React,{useState,useEffect} from "react";
import { getPostById } from "../../utils/Models";

 function PageTop3(props){
    const[title, setTitle] = useState('');
    const [content, setContent] = useState('')
    useEffect(async()=>{

        getPostById(props.id).then((res)=>{
            let data=res.data

            setTitle(data.title);
            setContent(data.content);
        })
    },[])


    return(
        <section className="gallery_title full_width">
            <div className="center">
                <div className="gallery_title_in full_width flex direction_column justify_center align_center">
                    <h2>{title}</h2>
                    <p>
                       {content}
                    </p>
                </div>
            </div>
        </section>
    )

}
export default PageTop3;