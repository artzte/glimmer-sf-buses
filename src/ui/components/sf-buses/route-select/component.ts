import Component, { tracked } from '@glimmer/component';

export default class RouteSelect extends Component {
  @tracked visible = 'hidden'
  @tracked args;

  @tracked('args')
  get selectedRoutesTitle() {
    const selectedRoutes = this.args.selectedRoutes;

    if (selectedRoutes.length === 0) {
      return `All ${this.args.routes.length} routes`;
    }

    return selectedRoutes
      .map(r => r.title)
      .join('; ');
  }

  showSelect() {
    this.visible = this.visible === 'visible' ? 'hidden' : 'visible';
  }

  selectRoute(route) {
    this.visible = 'hidden';
    this.args.selectRoutes([route]);
  }
};
