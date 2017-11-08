import Component, { tracked } from '@glimmer/component';
import Navigo from 'navigo';
import { fetchRoutes, fetchRouteLocations } from '../../../utils/fetch-routes';

const router = new Navigo(null, true, '#!');

export default class SfBuses extends Component {
  @tracked routes : any;
  @tracked selectedRouteTag = '';
  @tracked count: any = { value: 0 };

  didInsertElement() {
    this.loadRoutes();

    router
      .on({
        '/routes/:route': (params) => this.showRoute(params),
      })
      .on(() => this.showRoot())
      .resolve();

    setInterval(() => {
      this.count = Object.assign({}, {
        value: this.count.value + 1,
      });
      console.log('counts is now', this.count);
    }, 500)

    router.notFound(() => router.navigate('/'));
  }

  getMyBoo() {
    return new Promise((resolve) => {
      resolve(this.count);
    });
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
  loadRoutes() {
    fetchRoutes()
      .then((routes) => {
        this.routes = routes;
      });
  }

  showRoot() {
    this.selectedRouteTag = '';
  }

  showRoute(params) {
    console.log(params)
    this.selectedRouteTag = params.route;
  }
}
