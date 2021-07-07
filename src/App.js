import React,{useState,useEffect} from "react";
import {Route, BrowserRouter,Switch} from 'react-router-dom';

import { getBasket, getTranslate } from "./utils/Models";

//general component
import Header from "./components/template/Header";
import Footer from "./components/template/Footer";

//home page
import Index from "./components/home/Index";

//pages
import About from "./components/pages/About";
import Shop from "./components/pages/Shop";
import Blog from "./components/pages/Blog";
import Galery from "./components/pages/Galery";
import Contact from "./components/pages/Contact";
import Cart from "./components/pages/Cart";
import Wishlist from "./components/pages/Wishlist";
import Checkout from "./components/pages/Checkout";


//posts
import SingleBlog from "./components/posts/SingleBlog";
import SingleProduct from "./components/posts/SingleProduct";





export const TranslateList=React.createContext();
export const BasketList=React.createContext();


export default function App(){
  const [translate, setTranslate] = useState({});

  const [basket, setBasket] = useState([])
  
  useEffect(() => {

    getTranslate().then((res)=>{
       setTranslate(res.data);
  })
  
 
  }, [])

  return(
    <>
   <TranslateList.Provider value={translate}>
   <BrowserRouter>
   <Header/>

<main className="full_width">
  <Switch>
    
    <Route path="/" exact component={Index} />
    <Route path="/about" exact component={About} />
    <Route path="/shop" component={Shop} />
    <Route path="/shop_item/:item_link" exact component={SingleProduct} />
    <Route path="/blog" component={Blog} />
    <Route path="/read_blog/:blog_link" exact component={SingleBlog} />
    <Route path="/galery" exact component={Galery} />
    <Route path="/contact" exact component={Contact} />
    <Route path="/cart" exact component={Cart} />
    <Route path="/wishlist" exact component={Wishlist} />
    <Route path="/checkout" exact component={Checkout} />
    </Switch>

</main>

<Footer/>

</BrowserRouter>

   </TranslateList.Provider>
    </>
  )
}

