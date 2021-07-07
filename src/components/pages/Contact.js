import React,{useState, useEffect } from 'react';
import { TranslateList } from '../../App';
import { AppendScript, AppendStyle } from '../../utils/Append';
import { getPostsByType,sendFormData,getPostById } from '../../utils/Models';

export default function Contact(){
    const [posts, setPosts] = useState([]);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false)
    const [pageData, setPageData] = useState([])
    const [mapData, setMapData] = useState({})

    const tr_list=React.useContext(TranslateList);
  

      useEffect(()=>{
          AppendStyle('contact')

        AppendScript('true','assets/js/map.js');
        AppendScript(true,'https://maps.googleapis.com/maps/api/js?key=AIzaSyD7TypZFTl4Z3gVtikNOdGSfNTpnmq-ahQ&callback=initMap&language=az');
         

          getPostById(32).then((res)=>{
                
                setPageData(res.data);
                setMapData(res.data.metas.map)    
          })


          getPostsByType(13).then((res)=>{
            let res_data=res.data;
            console.log('res_data',res_data);
             
            const posts=[];
            for(let index in res_data.data){
                let row=res_data.data[index];

                posts.push({
                    title:row.title,
                    content:row.content,
                    icon:row.metas.icon_class

                })
            }
            setPosts(posts)
        })
  
        },[])

    const sendMessage=(e)=>{
        e.preventDefault(); 
        
        if(fullName && email && phone && message){
            setShowError(false)
            sendFormData(
                {
                  contact_form:true,
                  title:fullName,
                  'meta[1]':email,
                  'meta[2]':phone,
                  content:message
                }
            ).then((res)=>{
              setFullName('');
              setEmail('');
              setPhone('');
              setMessage('')
              alert('Mesajınız göndərildi')

              document.getElementById('contact_form').reset();

            })
            

        }else{
            setShowError(true)
        }
    }
    const setState=(function_name, e)=>{

      function_name(e.target.value)

    }
    
    return(
        
     <>
       
       <section className="map full_width">
            <div className="center full_height">
               {/* <div id="map" className="map_box" data-zoom={mapData.zoom} data-latitude={mapData.lat} data-longitude={mapData.lon} data-icon="assets/images/map_marker.png"   data-title="Baki">
               </div> */}
               <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3040.281725670966!2d49.83306591476041!3d40.35827716711747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307dffd00e6133%3A0x137483827cf83c8c!2sD%C9%99niz%20Mall!5e0!3m2!1saz!2s!4v1625319029171!5m2!1saz!2s" width="600" height="450" style={{'border':'0','width':'100%'}} allowfullscreen="" loading="lazy"></iframe>
            </div>
        </section>

        <scection className="store_addresses full_width">
            <div className="center">
                <div className="store_addresses_in full_width">
                    <div className="swipe_box">
                       {
                           posts &&  <ul className="address_list flex">
                           
                              {
                                  posts.map((item,key)=>{
                                      return(
                                        <li>
                                            <span>
                                                <i className={item.icon}style={{'fontSize':'40px'}}></i>                    
                                            </span>
                                            <div className="address_info">
                                                <h4>{item.title}</h4>
                                                <p>{item.content}</p>
                                            </div>
                            
                                        </li>
                                      )
                                  })
                              }
                           </ul>
                       }
                </div>
                </div>
            </div>
        </scection>
       
        <section className="contact full_width">
            <div className="center">
                <div className="contact_in  flex justify_space_between">
                    <div className="contact_in_left">
                        <h3>{pageData.title}</h3>
                        <p>
                           {pageData.content}
                        </p>
                        <span>
                         {
                             pageData.excerpt
                         }
                        </span>
                        <ul className="social_links">
                            <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                            <li><a href="#"><i className="fas fa-globe"></i></a></li>
                            <li><a href="#"><i className="fab fa-twitter"></i></a></li>
                        </ul>
                    </div>
                    <div className="contact_in_right full_width">
                        <form onSubmit={sendMessage.bind(this)} id="contact_form">
                            <ul className="contact_form_list full_width flex direction_column">
                                <li>
                                    <input type="text" id="full_name" placeholder="Full Name" className="contact_input" defaultValue={fullName} onKeyUp={setState.bind(this,setFullName)} />
                                    {
                                        (showError && !fullName) && <span>* This field must be filled</span>
                                    }

                                </li>
                                <li>
                                    <input type="email" id="email" placeholder="Email address" className="contact_input" defaultValue={email} onKeyUp={setState.bind(this,setEmail)} />
                                    {
                                        (showError && !fullName) && <span>* This field must be filled</span>
                                    }
                                </li>
                                <li>

                                    <input type="text" id="website" placeholder="Phone number" className="contact_input" defaultValue={phone} onKeyUp={setState.bind(this,setPhone)} />
                                
                                </li>
                                <li>
                                    <textarea id="message" rows="10" cols="40"
                                        className="textarea" onKeyUp={setState.bind(this,setMessage)} defaultValue={message} placeholder="Write a message"></textarea>
                                   {
                                        (showError && !fullName) && <span>* This field must be filled</span>
                                    }
                                </li>
                                <li>
                                    <button type="submit" className="form_submit">Submit</button>
                                </li>
                            </ul>
                        </form>


                    </div>
                </div>
            </div>
        </section>

     </>
 

    )
}