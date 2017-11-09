import Component, { tracked } from '@glimmer/component';

export default class RouteSelectOption extends Component {
  @tracked('route')
  get url() {
    const route = this.args.route;

    if (route) {
      return `/#!/routes/${route.tag}`;
    } else {
      return `/#!/`
    }
  }
};
