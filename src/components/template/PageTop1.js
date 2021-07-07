import React,{useState,useEffect} from "react";
import { getPostById } from "../../utils/Models";

 function PageTop1(props){
    const[title, setTitle] = useState('');
    const [coverImage, setCoverImage] = useState('')

    useEffect(async()=>{

        getPostById(props.id).then((res)=>{
            let data=res.data

            setTitle(data.title);
            setCoverImage(data.featured);
        })
    },[])


    return(
        <section className="parallax full_width flex justify_center align_center" style={{"backgroundImage":"url("+coverImage+")"}}>
            <h1>{title}</h1>
        </section>
    )

}
export default PageTop1;