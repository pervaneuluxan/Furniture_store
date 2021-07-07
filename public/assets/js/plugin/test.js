$(document).ready(function () {
    $(".counter").countUp();
  
    $(".owl-carousel").owlCarousel({
      loop: true,
      margin: 30,
      nav: true,
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 3,
        },
        1000: {
          items: 4,
        },
      },
    });
  
    //single blog page comment section chane even comment position
    if ($(".comments").length) {
      $(".single-comment:odd").addClass("middle-comment");
    }
  });
  
  //navbar active class
  const listTag = document.querySelectorAll(".navbar-item a ");
  const navbarList = document.querySelector(".navbar-list");
  const currentLoaction = location.href;
  const menuLength = listTag.length;
  
  if (navbarList != null) {
    for (let i = 0; i < menuLength; i++) {
      if (listTag[i].href === currentLoaction) {
        listTag[i].parentElement.classList.add("activeNav");
      }
    }
  }
  
  //shop page price filter value show
  const products = document.querySelector("#products");
  const inputVal = document.querySelector(".inputPrice");
  const price = document.querySelector(".price-value");
  
  if (products != null) {
    inputVal.addEventListener("change", function () {
      price.innerHTML = inputVal.value;
    });
  }
  
  //about page display content on click
  const headerItem1 = document.querySelector(".company-items-header .one");
  const headerItem2 = document.querySelector(".company-items-header .two");
  const headerItem3 = document.querySelector(".company-items-header .three");
  const body1 = document.querySelector(".goals");
  const body2 = document.querySelector(".values");
  const body3 = document.querySelector(".missions");
  const choose = document.querySelector("#choose");
  
  if (choose != null) {
    headerItem2.addEventListener("click", function () {
      body2.classList.add("active-content");
      body3.classList.remove("active-content");
      body1.classList.remove("active-content");
      headerItem1.classList.remove("active");
      headerItem2.classList.add("active");
      headerItem3.classList.remove("active");
    });
  }
  
  if (choose != null) {
    headerItem3.addEventListener("click", function () {
      headerItem2.classList.remove("active");
      headerItem1.classList.remove("active");
      headerItem3.classList.add("active");
      body3.classList.add("active-content");
      body1.classList.remove("active-content");
      body2.classList.remove("active-content");
    });
  }
  
  if (choose != null) {
    headerItem1.addEventListener("click", function () {
      headerItem2.classList.remove("active");
      headerItem1.classList.add("active");
      headerItem3.classList.remove("active");
      body3.classList.remove("active-content");
      body1.classList.add("active-content");
      body2.classList.remove("active-content");
    });
  }
  
  //navbar responsive menu
  const nav = document.querySelector(".navbar-responsive");
  const navBurger = document.querySelector(".navbar-responsive-btn");
  const navList = document.querySelector(".navbar-list");
  let menuOpen = false;
  
  nav.addEventListener("click", function () {
    if (!menuOpen) {
      nav.classList.add("open");
      menuOpen = true;
      navList.style.transform = "translateX(0px)";
    } else {
      nav.classList.remove("open");
      menuOpen = false;
      navList.style.transform = "translateX(-400px)";
    }
  });
  
  //home page slide third image content color
  const slider = document.querySelector("#slider");
  const title = document.querySelector(".black");
  const contentText = document.querySelector(".blackText");
  
  if (slider != null) {
    if (title.classList.contains("black")) {
      title.style.color = "black";
      contentText.style.color = "black";
    }
  }
  
  //animate home page products in window scroll
  const productScroll = document.querySelector("#product");
  const product = document.querySelector(".animateProduct");
  const productTwo = document.querySelector(".animateProductFromLeft");
  const productDeatil = document.querySelector(".product-detail");
  
  if (productScroll != null) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 250) {
        product.classList.add("animate__animated", "animate__fadeInRightBig");
      }
  
      if (window.scrollY > 1750) {
        productTwo.classList.add("animate__animated", "animate__fadeInLeftBig");
      }
    });
  }
  
  //shop page pagenation
  const liTag = document.querySelector(".pagenationContainer").children;
  
  if (liTag != null) {
    for (let i = 0; i < liTag.length; i++) {
      liTag[i].addEventListener("click", function () {
        liTag[i].classList.add("activePage");
        liTag[i].previousElementSibling.classList.remove("activePage");
        liTag[i].nextElementSibling.classList.remove("activePage");
      });
    }
  }
  