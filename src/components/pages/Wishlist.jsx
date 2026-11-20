import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { AppendStyle } from '../../utils/Append';
import PageTop1 from '../template/PageTop1';
import { getBasket } from '../../utils/Models';
import { useGlobalContext } from '../../utils/CartContext';

const WISHLIST_KEY = 'wishlist';

const readWishlist = () => {
    try {
        return JSON.parse(window.localStorage.getItem(WISHLIST_KEY)) || {};
    } catch {
        return {};
    }
};

export default function Whislist(){
    const { translate, addBasket } = useGlobalContext();
    const [products, setProducts] = useState([]);
    const [version, setVersion] = useState(0);

    useEffect(() => {
        AppendStyle('wishlist');
    }, []);

    useEffect(() => {
        const ids = Object.keys(readWishlist()).join(',');
        if (!ids) {
            setProducts([]);
            return;
        }
        getBasket(ids)
            .then((res) => {
                setProducts(res.data.data.map((row) => ({
                    id: row.id,
                    title: row.title,
                    featured: row.featured,
                    link: row.slug,
                    has_discount: row.has_discount,
                    price: row.price,
                    discount_price: row.discount_price,
                    stock: row.stock,
                })));
            })
            .catch(() => setProducts([]));
    }, [version]);

    const removeItem = (productId) => {
        if (!window.confirm('Are you sure delete this?')) return;
        const wishlist = readWishlist();
        delete wishlist[productId];
        window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
        setVersion((v) => v + 1);
    };

    return(
        
     <>
       
     <PageTop1 slug="wishlist"/>

       <section className="wishlist full_width">
           <div className="center">
               <div className="wishlist_in full_width">
                   {
                       (products.length >0) ? <>  <table className=" whishlist_table full_width">
                       <tbody>
                        {
                            products.map((item,key)=>{
                                return(
                                    <tr key={item.id} className="whishlist_item full_width">
                                        <td className="product_remove"><button type="button" onClick={() => removeItem(item.id)} className="prd_remove">×</button></td>
                                        <td className="product_img"><Link to={"/shop_item/"+item.link}><img src={item.featured} alt={item.title}/></Link></td>
                                        <td className="product_name"><Link to={"/shop_item/"+item.link}>{item.title}</Link></td>
                                        <td className="product_price"> 
                                        {
                                         item.has_discount ? <>
                                                    <span className="old_price"><del>${item.price}</del></span>
                                                    <span className="new_price">${item.discount_price}</span>   
                                                </> :<span className="new_price">${item.price}</span>
                                          
                                         }
                                        </td>
                                        <td className="product_stock_status">{
                                        (item.stock > 0) ?<span>In stock</span>:<span>Sold out</span>
                                        }</td>
                                        <td className="product_add_to_cart"><button type="button" onClick={() => addBasket(item.id, 1)} disabled={item.stock < 1}>{translate.add_to_cart}</button></td>
                                    </tr>
                                )
                            })
                        }
                       </tbody>
                   </table></>:<div className="empty_wishlist full_width">
                       No products were added to the wishlist	
                   </div>
                 
                   }
                 
               </div>
           </div>
       </section>


     </>
 

    )
}