import React,{useState,useEffect} from "react";
import { getPage } from "../../utils/Models";

 function PageTop3(props){
    const[title, setTitle] = useState('');
    const [content, setContent] = useState('')
    useEffect(()=>{

        getPage(props.slug).then((res)=>{
            let data=res.data

            setTitle(data.title);
            setContent(data.content);
        })
    },[props.slug])


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