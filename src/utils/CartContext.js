import React,{useState,useEffect,useContext} from "react";
import { getTranslate,getBasket } from "./Models";

const AppContext=React.createContext();


const AppProvider=({children})=>{
    const [translate, setTranslate] = useState({});
    const [cart,setCart]=useState([]);
    const [total, setTotal] = useState(0);
    const [updateBasket, setUpdateBasket] = useState(false)

    const l_storage=window.localStorage;
    const basket_key='basket';
    const checkBasket=l_storage.getItem('basket');

    

     useEffect(() => {

         if(checkBasket){
           const cart_data=JSON.parse(checkBasket);
           const ids=Object.keys(cart_data).join(',');
           
           if(ids.length > 0){
            getBasket(ids).then((res)=>{

                let res_data=res.data;
   
               const products=[];
               for(let index in res_data.data){
                   let row=res_data.data[index];
                  
                   let discount=row.metas.discount,
                   price=row.metas.price,
                   discount_start_date = new Date(row.metas.discount_start_date),
                   discount_end_date = new Date(row.metas.discount_end_date),
                   now_date=new Date(),
                   calc_discount=(price * (100 - discount)) / 100;
                 
                  
               let has_discount=(discount_start_date <= now_date && discount_end_date >= now_date) ? true:false;
                 
               let qty=cart_data[row.id];
   
       
               let sum=(has_discount) ? qty *calc_discount :qty *price;
                 
               setTotal(prevState=>prevState+sum);
   
               products.push({
                       id:row.id,
                       title:row.title,
                       featured:row.featured,
                       excerpt:row.excerpt,
                       metas:row.metas,
                       link:row.slug,
                       date:row.date,
                       has_discount:has_discount,
                       price:price,
                       discount_price:calc_discount,
                       qty:qty,
                       sum:sum,
                       stock:row.metas.stock
                   })
                  
               }
             setCart(products);
            })
           } else{
              setCart([]);
           }
        }

    getTranslate().then((res)=>{
       setTranslate(res.data);
  })
  
 
  }, [updateBasket])
  const updateItemCount=(product_id, e)=>{
        console.log(e, e.target.value)

        const old_data=JSON.parse(l_storage.getItem(basket_key));
           
           
        old_data[product_id]=e.target.value;

        l_storage.setItem(basket_key,JSON.stringify(old_data));
         
        setTotal(0);
        setUpdateBasket(Math.random());
    }
    const removeItem=(product_id, e)=>{
        if(window.confirm("Are you sure delete this?")){
            console.log(e, e.target.value)

            const old_data=JSON.parse(l_storage.getItem(basket_key));
               
               
            delete old_data[product_id];
    
            l_storage.setItem(basket_key,JSON.stringify(old_data));
             
            setTotal(0);
            setUpdateBasket(Math.random());
        }
    }
    const addWishlist=(product_id)=>{
    const  l_storage=window.localStorage;
  
    const wishlist_key="wishlist";
      
    const checkWishlist=l_storage.getItem(wishlist_key);
    

    if(checkWishlist){
       
       const old_data=JSON.parse(l_storage.getItem(wishlist_key));

      old_data[product_id]=product_id;

       l_storage.setItem(wishlist_key,JSON.stringify(old_data))

    }else{
      // Birinci defe

      l_storage.setItem(wishlist_key,JSON.stringify(
       
        {[product_id]:product_id}
        
        ))

    }
    alert('Mehsul');
    
    }   
    const addBasket=(product_id,count)=>{
  
    const basket_key='basket';
    const checkBasket=l_storage.getItem(basket_key);

    

    if(checkBasket){
          // Artiq sebetde mehsul var
       const old_data=JSON.parse(l_storage.getItem(basket_key));

      old_data[product_id]=count

       l_storage.setItem(basket_key,JSON.stringify(old_data))
       setTotal(0)
      setUpdateBasket(Math.random());

    }else{
      // Birinci defe elavə edilir

      l_storage.setItem(basket_key,JSON.stringify(
       
        {[product_id]:count}
        
        ))
        setTotal(0 )
      setUpdateBasket(Math.random());

    }
    // window.location.href=window.location.href;
   
  
   
    }

    return <AppContext.Provider value={{
        translate,
        cart,
        removeItem,
        updateItemCount,
        total,
        addWishlist,
        addBasket

    }}>
        {children}
    </AppContext.Provider>
}

export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }