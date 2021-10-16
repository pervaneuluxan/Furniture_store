import axios from "axios";
import FormData from "form-data";

const l_storage=window.localStorage,
check_lang=l_storage.getItem('default_lang');

const lang_slug=check_lang;

export const getPostsByType=async(post_type,post_limit=100,page=1,order_by='')=>{
    const  form_data = new FormData();
    form_data.append('get_posts', 'true');
    form_data.append('post_type', post_type);
    form_data.append('post_limit', post_limit);
    form_data.append('lang_slug',lang_slug)
    form_data.append('order_by', order_by);
    form_data.append('page', page);
    


    return await axios({
    method: 'post',
    url: process.env.REACT_APP_API_URL,
    data : form_data
    })
}
export const getMenusByType=async(menu_type)=>{
    const  form_data = new FormData();
    form_data.append('get_menus', 'true');
    form_data.append('lang_slug',lang_slug);
    form_data.append('menu_type', menu_type);

   return await axios({
    method: 'post',
    url:process.env.REACT_APP_API_URL,
    data : form_data
    })
}
export const getPostById=async(post_id)=>{
    const  form_data = new FormData();
    form_data.append('get_post', 'true');
    form_data.append('post_id', post_id);
    form_data.append('lang_slug',lang_slug);

   return await axios({
    method: 'post',
    url: process.env.REACT_APP_API_URL,
    data : form_data
    })
}

export const getPostBySlug=async(slug)=>{
    const  form_data = new FormData();
    form_data.append('get_post_by_slug', 'true');
    form_data.append('slug', slug);
    form_data.append('lang_slug',lang_slug)

   return await axios({
    method: 'post',
    url: process.env.REACT_APP_API_URL,
    data : form_data
    })
}

export const getCategories=async(category_type)=>{
    const  form_data = new FormData();
    form_data.append('get_categories', 'true');
    form_data.append('category_type', category_type);
    form_data.append('lang_slug',lang_slug);

   return await axios({
    method: 'post',
    url: process.env.REACT_APP_API_URL,
    data : form_data
    })
}

export const sendFormData=async(post_data={})=>{
    const  form_data = new FormData();
    
    for(let key in post_data){
        form_data.append(key,post_data[key]);
    }

   return await axios({
    method: 'post',
    url: process.env.REACT_APP_API_URL,
    data : form_data
    })
}

export const getTranslate=async()=>{
    const  form_data = new FormData();
    form_data.append('get_translate', 'true');
    form_data.append('lang_slug',lang_slug);
  
   return await axios({
    method: 'post',
    url:process.env.REACT_APP_API_URL,
    data : form_data
    })
}

export const getBasket=async(ids)=>{
    const  form_data = new FormData();
    form_data.append('get_basket', 'true');
    form_data.append('ids', ids);
    form_data.append('lang_slug',lang_slug);

  
   return await axios({
    method: 'post',
    url:process.env.REACT_APP_API_URL,
    data : form_data
    })
}


export const addBasket=(product_id,count)=>{
  
    const basket_key='basket';
    const checkBasket=l_storage.getItem(basket_key);
    

    if(checkBasket){
          // Artiq sebetde mehsul var
       const old_data=JSON.parse(l_storage.getItem(basket_key));

      old_data[product_id]=count

       l_storage.setItem(basket_key,JSON.stringify(old_data))

    }else{
      // Birinci defe elavə edilir

      l_storage.setItem(basket_key,JSON.stringify(
       
        {[product_id]:count}
        
        ))

    }
    // window.location.href=window.location.href;
   
  
   
}

export const addWishlist=(product_id)=>{
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
 