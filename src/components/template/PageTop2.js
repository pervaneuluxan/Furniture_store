import React,{useState,useEffect,} from "react";
import { getPostById } from "../../utils/Models";

 function PageTop2(props){
    const[title, setTitle] = useState('');
    const [content, setContent] = useState('')

    useEffect(()=>{

        getPostById(props.id).then((res)=>{
            let data=res.data

            setTitle(data.title);
            setContent(data.content);
        })
    },[])


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