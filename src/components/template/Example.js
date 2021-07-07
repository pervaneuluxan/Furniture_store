import React,{useState,useEffect} from "react";
import {Route,BrowserRouter,Switch} from 'react-router-dom';

import { getTranslate } from "./utils/Models";

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


export default function App(){
  const [translate, setTranslate] = useState({});
  
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

  <main>
 
    <Switch>


    <Route path="/" exact={true}>
      <Index/>
    </Route>

    <Route path="/about" exact={true}>
      <About/>
    </Route>

    <Route path="/shop" exact={false}>
      <Shop/>
    </Route>

    <Route path="/shop_item/:item_link"  exact={true}>
      <SingleProduct/>
    </Route>

    <Route path="/blog" exact={false}>
      <Blog/>
    </Route>

    <Route path="/read_blog/:blog_link" exact={true}>
      <SingleBlog/>
    </Route>

    <Route path="/galery" exact={true}>
      <Galery/>
    </Route>

    <Route path="/contact" exact={true}>
      <Contact/>
    </Route>

    <Route  path="/cart" exact={true}>
      <Cart/>
    </Route>

    <Route   path="/wishlist" exact={true}>
      <Wishlist/>
    </Route>
    
    <Route  path="/checkout" exact={true}>
      <Checkout/>
    </Route>
    
    </Switch>

  

  </main>

  <Footer/>

</BrowserRouter>
   </TranslateList.Provider>
    </>
  )
}

