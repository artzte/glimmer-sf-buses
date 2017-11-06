import Component, { tracked } from '@glimmer/component';

export default class RouteSelect extends Component {
  onChange(event) {
    this.args['on-change'](event.target.value);
  }
};
