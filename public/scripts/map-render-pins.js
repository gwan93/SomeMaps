/* eslint-disable no-undef */
// let detailPopup = L.popup({
//   eiditable: true,
//   removable: true
// }).setContent(
//   `<div class="card border-primary mb-2 pin-pop">
//    <img src =https://images.unsplash.com/photo-1546421845-6471bdcf3edf?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTJ8fGRvZ3N8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60 class="card-img-top">
//    <div class="card-body text-primary">
//    <h5 class="card-title">${pin.pin_title}</h5>
//    <small id="map-author-rating">
//      <p class="card-text">Rating: ${pin.review}/5</p>
//      <p class="card-text">${pin.pin_description}</p>
//    </small>
//    </div>
//   `);

$(document).ready(function() {

  // Render pins when a map card is clicked.
  $(document).on('click', '.map-card', function() {
    let id = this.id
    $.get(`/api/maps/${id}`)
      .then(maps => {
        markerGroup.clearLayers();
        let marker;
        for (const pin of maps) {
          let ratingStr = '';
          if (pin.rating) {
            ratingStr = `Rating: ${pin.rating}`;
          } else {
            ratingStr = `No rating`;
          }
          // console.log('######LOGGING######',pin);
          marker = new L.Marker([pin.pin_lat, pin.pin_lng]).bindPopup(
            `<div class="card border-primary mb-2 pin-pop">
            <img src=${pin.img_url} class="card-img-top">
            <div class="card-body text-primary">
            <h5 class="card-title">${pin.pin_title}</h5>
            <small id="map-author-rating">
              <p class="card-text">${ratingStr}</p>
              <p class="card-text">${pin.pin_description}</p>
            </small>
            </div>
           `,{
              removable: true,
              editable: false,
              nametag: `${pin.pin_title}`
            });
          markerGroup.addLayer(marker);
          marker = null;
        }
        markerGroup.addTo(mymap);
        mymap.fitBounds(markerGroup.getBounds());
        // console.log('render these:',maps);
      });
  });


});
