$('.fade').slick({
  dots: false,
  infinite: true,
  speed: 500,
  fade: true,
  cssEase: 'linear'
});
	

    $(".owl-carousel").owlCarousel({
        loop: true,
        margin: 30,
        nav: true,
        autoplay:true,
        autoplayTimeout:3000,
        smartSpeed: 1000, 
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
