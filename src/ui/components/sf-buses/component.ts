import Component, { tracked } from '@glimmer/component';
import Navigo from 'navigo';
import { fetchRoutes, fetchRouteLocations } from '../../../utils/fetch-routes';

const router = new Navigo(null, true, '#!');

export default class SfBuses extends Component {
  @tracked routes : any;
  @tracked selectedRouteTag = '';
  @tracked loading: Boolean = true;

  didInsertElement() {
    this.loadRoutes();

    router
      .on({
        '/routes/:route': (params) => this.showRoute(params),
      })
      .on(() => this.showRoot())
      .resolve();

    router.notFound(() => router.navigate('/'));
  }

  async refreshLocations(routes) {
    const time = 0;

    console.log('fetching locations with', this, routes)
    return await Promise.all(routes.map(route => fetchRouteLocations(route, time)));
  }

  // Property handlers
  //
  @tracked('selectedRouteTag')
  get selectedRoute() {
    const selectedRouteTag = this.selectedRouteTag;

    if (!selectedRouteTag) return null;

    return this.routes.find(route => route.tag === selectedRouteTag);
  }

  // Action handlers
  //
  selectRoute(route) {
    router.navigate(`/routes/${route.tag}`);
  }

  // Router callbacks
  //
  async loadRoutes() {
    const routes = await fetchRoutes()

    this.routes = routes;
    this.loading = false;
  }

  showRoot() {
    this.selectedRouteTag = '';
  }

  showRoute(params) {
    console.log(params)
    this.selectedRouteTag = params.route;
  }
}
