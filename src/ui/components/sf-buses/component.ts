import Component, { tracked } from '@glimmer/component';
import Navigo from 'navigo';
import { fetchRoutes } from '../../../utils/fetch-routes';

const router = new Navigo(null, true, '#!');

export default class SfBuses extends Component {
  @tracked routes = []
  @tracked selectedRouteTag = ''
  @tracked loading = true

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
        '/routes/:route': (params) => this.showRoute(params),
      })
      .on(() => this.showRoot())
      .resolve();

    router.notFound(() => router.navigate('/'));
  }

  // Property handlers
  //
  @tracked('selectedRouteTag')
  get selectedRoute() {
    const { selectedRouteTag } = this;

    if (!selectedRouteTag) return null;

    return this.routes.find(route => route.tag === selectedRouteTag);
  }

  // Action handlers
  //
  selectRoute(route) {
    router.navigate(`/routes/${route.tag}`);
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
    this.selectedRouteTag = '';
  }

  showRoute(params) {
    console.log(params)
    this.selectedRouteTag = params.route;
  }
}
