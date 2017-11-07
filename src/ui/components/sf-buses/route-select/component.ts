import Component, { tracked } from '@glimmer/component';

export default class RouteSelect extends Component {
  @tracked visible = 'hidden'

  showSelect() {
    this.visible = this.visible === 'visible' ? 'hidden' : 'visible';
  }

  selectRoute(route) {
    this.visible = 'hidden';
    this.args.selectRoute(route);
  }
};
