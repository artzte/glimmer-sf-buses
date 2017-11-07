import Component, { tracked } from '@glimmer/component';

export default class RouteSelectOption extends Component {
  @tracked('route')
  get url() {
    return `/#!/routes/${this.args.route.tag}`;
  }
};
