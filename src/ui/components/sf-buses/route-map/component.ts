import Component, { tracked } from '@glimmer/component';

const apiKey = 'AIzaSyA7xlBaE1zcBwPAKJEnYUO0e2FOOPGAsb0';

export default class RouteMap extends Component {
  map : any;
  markers : any;

  @tracked routesWithLocations: any;

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
    const center = {
      lat: 37.768528,
      lng: -122.290307,
    };

    this.map = new google.maps.Map(document.getElementById('gmap-canvas'), {
      zoom: 10,
      center,
    });

    this.args.refreshLocations(this.args.routes)
      .then((routesWithLocations) => {
        this.routesWithLocations = routesWithLocations;
        this.drawRoutes(routesWithLocations);
      });
  }

  drawRoutes(routes) {
    const map = this.map;
    const markers = this.markers || [];

    // clear any existing markers

    routes.forEach((route) => {
      const buses = route.buses;
      if (!buses) {
        console.log('whoops', route.tag);
        return;
      }

      buses.forEach((bus) => {
        const latLng = new google.maps.LatLng(bus.lat, bus.lon);
        const marker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: route.tag,
        });

        markers.push(marker);
      });
    });

    this.markers = markers;
  }
};


