import { NavLink } from "react-router-dom";
import { useGlobalContext } from "../../utils/CartContext";
export default (props)=>{

    const {addBasket,addWishlist}=useGlobalContext();
    
    const {item}=props;
    return(
        <>
        <div className="image full_width">
            <NavLink to={"/shop_item/"+item.link}><img src={item.featured} alt="" /></NavLink>
            <div className="overlay">
                <div className="overlay_content">
                    <NavLink to={"/shop_item/"+item.link}>Quick look</NavLink>
                    <button type="button"><i className="fas fa-heart" onClick={addWishlist.bind(this ,item.id)}></i></button>
                </div>
            </div>
        </div>
        <h5><NavLink to={"/shop_item/"+item.link}>{item.title}</NavLink></h5>
        <span className="rating_icon">
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="far fa-star"></i>
        </span>
        <div class="price">
           {
               item.has_discount ? <>
                <span class="old_price"><del>${item.price}</del></span>
                <span class="new_price">${item.discount_price}</span>   
            </> :<span class="new_price">${item.price}</span>
          
           }
        </div>
        <span className="add_to_cart" onClick={addBasket.bind(this,item.id ,1)}>Add to Cart</span>
        
     </>

    )
}