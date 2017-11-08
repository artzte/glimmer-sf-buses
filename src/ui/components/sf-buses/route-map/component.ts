import Component, { tracked } from '@glimmer/component';
import { fetchRouteLocations } from '../../../../utils/fetch-routes';

const apiKey = 'AIzaSyA7xlBaE1zcBwPAKJEnYUO0e2FOOPGAsb0';

export default class RouteMap extends Component {
  map : any;
  markers : any;

  didInsertElement() {
    this.loadGoogleMaps();

    // confirmed that this is working.. thanks @locks
    const ret = this.args.getBoo();
    console.log('getBoo yielded', ret);
  }

  // this only fires if booMsg is shown in the template.
  // I would like it to fire whever I get a new booCount without the
  // requirement that I bind this getter in the template.
  //
  @tracked('args')
  get booMsg() {
    console.log('args', this.args);
    return 'Boo ' + this.args.booCount.value;
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

    this.getBusesForRoutes()
      .then((busesForRoutes) => {

        console.log('busesForRoutes', busesForRoutes);
        this.drawRoutes(busesForRoutes);
      });
  }

  async getBusesForRoutes() {
    const time = 0;

    const routes = this.args.routes;

    console.log('routes', routes);

    return await Promise.all(routes.map(route => fetchRouteLocations(route, time)));
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


