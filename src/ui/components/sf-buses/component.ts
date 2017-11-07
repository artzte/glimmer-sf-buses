import Component, { tracked } from '@glimmer/component';
import Navigo from 'navigo';
import { fetchRoutes } from '../../../utils/fetch-routes';

const router = new Navigo(null, true, '#!');

export default class SfBuses extends Component {
  @tracked routes = []
  @tracked selectedRoute = ''
  @tracked loading = true

  didInsertElement() {
    router.hooks({
      before: (done) => {
        return this.loadRoutes(done);
      },
    });

    router
      .on({
        '/routes/:route': (params) => this.showRoute(params),
      })
      .on(() => this.showRoot())
      .resolve();

    router.notFound(() => router.navigate('/'));
  }

  // Property handlers
  //
  @tracked('selectedRoute')
  get selectedRouteName() {
    const selectedRoute = this.selectedRoute;

    if (!selectedRoute) return 'All routes';

    const matchingRoute = this.routes.find(route => route.tag === selectedRoute);
    if (matchingRoute) {
      return matchingRoute.title;
    }
  }

  // Action handlers
  //
  selectRoute(route) {
    router.navigate(`/routes/${route}`);
  }

  // Route handlers
  //
  loadRoutes(done) {
    return fetchRoutes().then((routes) => {
      this.routes = routes;
      this.loading = false;
      done();
    });
  }

  showRoot() {
    console.log('showRoot')
    this.selectedRoute = '';
  }

  showRoute(params) {
    console.log(params)
    this.selectedRoute = params.route;
  }
}
