import Component, { tracked } from '@glimmer/component';
import Navigo from 'navigo';
import { fetchRoutes, fetchRouteLocations } from '../../../utils/fetch-routes';

const router = new Navigo(null, true, '#!');

export default class SfBuses extends Component {
  @tracked routes : Array<any> = [];
  @tracked selectedRoutes : Array<any>;
  @tracked loading: Boolean = true;

  didInsertElement() {
    router.hooks({
      before: (done) => {
        if (this.loading) {
          return this.loadRoutes(done);
        }
        done();
      },
    });

    router
      .on({
        '/routes/:routes': (params) => this.showRoute(params),
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

  // Action handlers
  //
  selectRoutes(routes) {
    const tags = routes
      .map(route => route.tag)
      .join(',');

    router.navigate(`/routes/${tags}`);
  }

  // Router callbacks
  //
  async loadRoutes(done) {
    const routes = await fetchRoutes()

    this.routes = routes;
    this.loading = false;

    done();
  }

  showRoot() {
    this.selectedRoutes = [];
  }

  showRoute(params) {
    const tags = params.routes.split(',');
    const routes = this.routes;
    const matchingRoutes = tags
      .map(tag => routes.find(route => route.tag === tag))
      .filter(route => route);

    this.selectedRoutes = matchingRoutes;
  }
}
