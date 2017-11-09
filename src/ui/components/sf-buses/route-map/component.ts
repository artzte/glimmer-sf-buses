import Component, { tracked } from '@glimmer/component';
import { googleMapsApiKey } from '../../../../utils/secure';

const LOCATIONS_REFRESH_CYCLE = 15000;
const ROUTES_REFRESH_CYCLE = 500;

function getRoutesRefreshTag(routes) {
  return routes
    .map(route => route.tag)
    .sort()
    .join('|');
}

function getRoutesToRefresh(selectedRoutes, allRoutes) {
  return selectedRoutes.length ? selectedRoutes : allRoutes;
}

export default class RouteMap extends Component {
  map : any;
  markers : any;
  routesRefreshTag : any;
  mapRefreshTimer : any;
  routesCheckTimer : any;
  refreshPromise : any;

  @tracked routesWithLocations: any;

  didInsertElement() {
    this.loadGoogleMaps();
    this.mapRefreshTimer = setInterval(() => {
      this.refreshRoutes();
    }, LOCATIONS_REFRESH_CYCLE);


    this.routesCheckTimer = setInterval(() => {
      this.checkResetRoute();
    }, ROUTES_REFRESH_CYCLE);
  }

  willDestroyElement() {
    clearInterval(this.mapRefreshTimer);
    clearInterval(this.routesCheckTimer);
  }

  loadGoogleMaps() {
    document.body.appendChild(Object.assign(
      document.createElement('script'), {
        type: 'text/javascript',
        src: `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}`,
        onload: () => this.onMapInit()
      }));
  }

  onMapInit() {
    const center = {
      lat: 37.725655,
      lng: -122.451146,
    };

    this.map = new google.maps.Map(document.getElementById('gmap-canvas'), {
      zoom: 12,
      center,
      mapTypeControl: false,
      fullscreenControl: false,
    });

    this.refreshRoutes();
  }

  checkResetRoute() {
    const newRoutesTarget = getRoutesToRefresh(this.args.selectedRoutes, this.args.routes);
    const newRefreshTarget = getRoutesRefreshTag(newRoutesTarget);

    if (this.routesRefreshTag !== newRefreshTarget) {
      this.refreshRoutes();
    }
  }

  refreshRoutes() {
    if (this.refreshPromise) {
      return;
    }

    const routesToFetch = getRoutesToRefresh(this.args.selectedRoutes, this.args.routes);

    this.routesRefreshTag = getRoutesRefreshTag(routesToFetch);

    this.args.setNoBusesRunning(false);

    this.refreshPromise = this.args.refreshLocations(routesToFetch);

    this.refreshPromise
      .then((routesWithLocations) => {
        this.routesWithLocations = routesWithLocations;
        this.refreshPromise = null;
        this.drawRoutes(routesWithLocations);

        const countOfBuses = routesWithLocations.reduce((count, route) {
          return count + route.buses.length;
        }, 0);

        this.args.setNoBusesRunning(countOfBuses === 0);
      });
  }

  drawRoutes(routes) {
    const map = this.map;
    const markers = [];
    const existingMarkers = this.markers || [];

    existingMarkers.forEach((marker) => {
      marker.setMap(null);
    });

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


