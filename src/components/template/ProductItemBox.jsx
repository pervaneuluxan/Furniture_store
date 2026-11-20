import { NavLink } from "react-router";
import { useGlobalContext } from "../../utils/CartContext";
export default function ProductItemBox(props) {

    const {addBasket,addWishlist}=useGlobalContext();
    
    const {item}=props;
    return(
        <>
        <div className="image full_width">
            <NavLink to={"/shop_item/"+item.link}><img src={item.featured} alt={item.title} /></NavLink>
            <div className="overlay">
                <div className="overlay_content">
                    <NavLink to={"/shop_item/"+item.link}>Quick look</NavLink>
                    <button type="button" onClick={() => addWishlist(item.id)} aria-label="Add to wishlist"><i className="fas fa-heart"></i></button>
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
        <div className="price">
           {
               item.has_discount ? <>
                <span className="old_price"><del>${item.price}</del></span>
                <span className="new_price">${item.discount_price}</span>   
            </> :<span className="new_price">${item.price}</span>
          
           }
        </div>
        <span className="add_to_cart" onClick={() => addBasket(item.id, 1)}>Add to Cart</span>
        
     </>

    )
}