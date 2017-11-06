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
        return this.loadRoutesAndNavigate(done);
      },
    });

    router
      .on({
        '/routes/:route': (params) => this.showRoute(params),
      })
      .on(() => this.loaded())
      .resolve();

    router.notFound(() => router.navigate('/'));
  }

  selectRoute(route) {
    router.navigate(`/routes/${route}`);
  }

  loaded() {
    this.selectedRoute = '';
  }

  loadRoutesAndNavigate(done) {
    return fetchRoutes().then((routes) => {
      this.routes = routes;
      this.loading = false;
      done();
    });
  }

  showRoute(params) {
    this.selectedRoute = params.route;
  }
}
