import React,{useState,useEffect,} from "react";
import { getPage } from "../../utils/Models";

 function PageTop2(props){
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
        <section className="blog_header full_width">
            <div className="center">
                <div className="blog_header_in">
                    <h5>{title}</h5>
                    <p>
                        {content}
                    </p>
                </div>
            </div>
        </section>
    )

}
export default PageTop2;