import { useState, useEffect } from 'react';
import { AppendStyle } from '../../utils/Append';
import { getPostsByType, getPage, sendContactMessage, apiErrorMessage } from '../../utils/Models';

const EMPTY_FORM = { fullName: '', email: '', phone: '', message: '' };

export default function Contact(){
    const [posts, setPosts] = useState([]);
    const [person, setPerson] = useState(EMPTY_FORM);
    const [showError, setShowError] = useState(false);
    const [sending, setSending] = useState(false);
    const [pageData, setPageData] = useState({});

    useEffect(()=>{
        AppendStyle('contact');

        getPage('contact').then((res) => setPageData(res.data));

        getPostsByType('address').then((res) => {
            setPosts(res.data.data.map((row) => ({
                title: row.title,
                content: row.content,
                icon: row.metas.icon_class,
            })));
        });
    },[]);

    const sendMessage = (e) => {
        e.preventDefault();

        if (!(person.fullName && person.email && person.phone && person.message)) {
            setShowError(true);
            return;
        }
        setShowError(false);
        setSending(true);
        sendContactMessage({
            name: person.fullName,
            email: person.email,
            phone: person.phone,
            message: person.message,
        })
            .then(() => {
                setPerson(EMPTY_FORM);
                alert('Mesajınız göndərildi');
            })
            .catch((error) => alert(apiErrorMessage(error)))
            .finally(() => setSending(false));
    };

    const handleChange = (e) => setPerson({ ...person, [e.target.name]: e.target.value });

    return(
        
     <>
       
       <section className="map full_width">
            <div className="center full_height">
               {/* <div id="map" className="map_box" data-zoom={mapData.zoom} data-latitude={mapData.lat} data-longitude={mapData.lon} data-icon="assets/images/map_marker.png"   data-title="Baki">
               </div> */}
               <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3040.281725670966!2d49.83306591476041!3d40.35827716711747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307dffd00e6133%3A0x137483827cf83c8c!2sD%C9%99niz%20Mall!5e0!3m2!1saz!2s!4v1625319029171!5m2!1saz!2s" width="600" height="450" style={{'border':'0','width':'100%'}} allowFullScreen="" loading="lazy"></iframe>
            </div>
        </section>

        <section className="store_addresses full_width">
            <div className="center">
                <div className="store_addresses_in full_width">
                    <div className="swipe_box">
                       {
                           posts &&  <ul className="address_list flex">
                           
                              {
                                  posts.map((item,key)=>{
                                      return(
                                        <li key={key}>
                                            <span>
                                                <i className={item.icon} style={{'fontSize':'40px'}}></i>                    
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
        </section>
       
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
                        <form onSubmit={sendMessage} id="contact_form">
                            <ul className="contact_form_list full_width flex direction_column">
                                <li>
                                    <input type="text" name="fullName" id="full_name" placeholder="Full Name" className="contact_input" value={person.fullName} onChange={handleChange} />
                                    {
                                        (showError && !person.fullName) && <span>* This field must be filled</span>
                                    }

                                </li>
                                <li>
                                    <input type="email"  name="email" id="email" placeholder="Email address" className="contact_input" value={person.email} onChange={handleChange} />
                                    {
                                        (showError && !person.email) && <span>* This field must be filled</span>
                                    }
                                </li>
                                <li>

                                    <input type="text" name="phone" id="website" placeholder="Phone number" className="contact_input" value={person.phone} onChange={handleChange} />
                                    {
                                        (showError && !person.phone) && <span>* This field must be filled</span>
                                    }
                                
                                </li>
                                <li>
                                    <textarea id="message" rows="10" cols="40"
                                        className="textarea" name="message" onChange={handleChange} value={person.message} placeholder="Write a message"></textarea>
                                   {
                                        (showError && !person.message) && <span>* This field must be filled</span>
                                    }
                                </li>
                                <li>
                                    <button type="submit" className="form_submit" disabled={sending}>{sending ? 'Sending…' : 'Submit'}</button>
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