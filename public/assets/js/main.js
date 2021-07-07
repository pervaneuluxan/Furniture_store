// //Active menu link
// const listTag = document.querySelectorAll(".navbar_item a");
// const navbarList = document.querySelector(".main_nav_menu");
// const currentLocation = location.href;
// const menuLength = listTag.length;

// if (navbarList != null) {
//   for (let i = 0; i < menuLength; i++) {
//     if (listTag[i].href === currentLocation) {
//       listTag[i].classList.add("current");
//     }
//   }
// }

//Toggle_Sections
     
  $('.mobile_categories_title').click(function(){
    $('.mobile_categories_list').slideToggle();
  })

  $('.filter').click(function(){
    $('.filter_dropdown').slideToggle();
  })
  $('.change_btn').click(function(){
    $('.shipping_info').slideToggle();
  })
  $('.login_show').click(function(){
    $('.login_form').slideToggle();
  })
  $('.coupon_show').click(function(){
    $('.coupon_form').slideToggle();
  })
  

//  Back to top button
$(window).scroll(function () {
  let scroll_top=$(this).scrollTop(),
    back_to_top=$('.back_to_top');

  if (scroll_top > 700) {

    back_to_top.addClass('active_btn');
   

    back_to_top.click(function(e){
      e.preventDefault();
      $('html, body').stop().animate({
        scrollTop : 0
      },500);
    })

  }else{
    back_to_top.removeClass('active_btn');
  }  
});



// Mobile_Navbar
  var nav_mobile_box=$('.nav_mobile_box');

  $('.mobile_nav_btn').click(function(){
      nav_mobile_box.addClass('show')

      setTimeout(()=>{
          nav_mobile_box.addClass('active_menu')
      },100)
  });

  function closeMenu(){
      nav_mobile_box.removeClass('active_menu')

      setTimeout(()=>{
          nav_mobile_box.removeClass('show')
      },400)

  }

  $('.nav_mobile_close_btn').click(function(){
    
      closeMenu();
  });
  $('*').click(function(e){
     if(!$(e.target).is('.nav_mobile_box_in') && !$(e.target).is('.nav_mobile_box_in *'))
     if(!$(e.target).is('.mobile_nav_btn') && !$(e.target).is('.mobile_nav_btn *')){
     
         closeMenu();
     }

    });

    $(window).keyup(function(e){
        var key_code=e.which || e.keyCode;
         
       if(key_code==27){
           closeMenu();
       }

    });
    $(window).resize(function(){
        closeMenu();
    });


    
    var login_main_box=$('#login_main'),
        login_box=$('#login_box')

    $('.login_open_btn').click(function(e){
   
       login_main_box.css({'display':'block'});
       register_main_box.css({'display':'none'})
        $('.login_active').css({'backgroundColor':'#f8f8f8'})
        $('.register_active').css({'backgroundColor':'transparent'})
    })
   
    $('*').click(function(e){
      if(!$(e.target).is('.login_box') && !$(e.target).is('.login_box *'))
      if(!$(e.target).is('.login_open_btn') && !$(e.target).is('.login_open_btn *')){
     
        login_main_box.css({'display':'none'});
        register_main_box.css({'display':'none'})
       

      }
 
     });


     var register_main_box =$('#register_main'),
         register_box=$('#register_box')

     $('.register_open_btn').click(function(){
       register_main_box.css({'display':'block'})
       login_main_box.css({'display':'none'})
       $('.register_active').css({'backgroundColor':'#f8f8f8'})
       $('.login_active').css({'backgroundColor':'transparent'})
     
     })

     $(window).scroll(function(){
       var scroll=$(window).scrollTop()
      if (scroll >= 1) {

          $('.header').addClass('fixed-header');
        
      }
      else {
          $('.header').removeClass('fixed-header');

      }
  });
  

$(window).resize( function() {

window.location.href = window.location.href;

});
  

     