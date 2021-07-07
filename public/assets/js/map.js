function init() {

    var map_selector = document.querySelector('#map');

    var mapOptions = {
        zoom: parseInt(map_selector.getAttribute("data-zoom")),
        mapTypeControl: true,
        center: new google.maps.LatLng(map_selector.getAttribute("data-latitude"), map_selector.getAttribute("data-longitude")), // New York
    };

    var map = new google.maps.Map(map_selector, mapOptions);
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(map_selector.getAttribute("data-latitude"), map_selector.getAttribute("data-longitude")),
        map: map,
        icon: {
            url: map_selector.getAttribute("data-icon"),
            scaledSize: new google.maps.Size(30, 30), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        },

        title: map_selector.getAttribute("data-title"),
    });


    //marker.setAnimation(google.maps.Animation.BOUNCE);
}

google.maps.event.addDomListener(window, 'load', init);