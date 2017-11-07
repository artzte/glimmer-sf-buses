import Component from '@glimmer/component';

const apiKey = 'AIzaSyA7xlBaE1zcBwPAKJEnYUO0e2FOOPGAsb0';

export default class RouteMap extends Component {
  didInsertElement() {
    this.loadGoogleMaps();
  }

  loadGoogleMaps() {
    document.body.appendChild(Object.assign(
      document.createElement('script'), {
        type: 'text/javascript',
        src: `https://maps.googleapis.com/maps/api/js?key=${apiKey}`,
        onload: () => this.onMapInit()
      }));
  }

  onMapInit() {
    console.log(google.maps);
    var uluru = {lat: -25.363, lng: 131.044};
    var map = new google.maps.Map(document.getElementById('gmap-canvas'), {
      zoom: 4,
      center: uluru
    });
    var marker = new google.maps.Marker({
      position: uluru,
      map: map
    });
  }
};


