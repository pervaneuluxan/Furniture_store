
    $('.single-item').slick({
        loop:true,
        focusOnSelect: true,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToScroll: 1,
        draggable: true,
        arrows: false,
        dots: false,
        fade: true,
        speed: 3000,
        infinite: true,
        cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
        touchThreshold: 100
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
