const propRegex = /(tag|title)="([^"]*)"/g;

function xml2JsonArray(routesXml) {
  return routesXml
    .split('\n')
    .reduce((memo, line) => {
      let obj;

      line.replace(propRegex, function(match, key, value) {
        obj = obj || {};
        obj[key] = value;
        return '';
      });

      if (obj) {
        memo.push(obj);
      }

      return memo;
    }, []);
}

export function fetchRoutes() {
  return fetch('http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=sf-muni')
    .then(result => result.text())
    .then((xmlResult) => {
      return xml2JsonArray(xmlResult);
    });
}
