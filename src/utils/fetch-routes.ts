const propRegex = /(tag|title|routeTag|lat|lon|id)="([^"]*)"/g;

function f(url, options = {}) {
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then((response) => {
        if (response.ok) {
          return resolve(response);
        }

        return reject(response)
      });
  });
}

function sanitize(string) {
  return string
    .replace(/&amp;/g, '&')
    .replace(/&apos;/g, '\'')
    .replace(/[^\w-_/ .]/g, '');
}

function xml2JsonArray(routesXml) {
  return routesXml
    .split('\n')
    .reduce((memo, line) => {
      let obj;

      line.replace(propRegex, function(match, key, value) {
        obj = obj || {};
        obj[key] = sanitize(value);
        return '';
      });

      if (obj) {
        memo.push(obj);
      }

      return memo;
    }, []);
}

export function fetchRoutes() {
  return f('http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=sf-muni')
    .then(result => result.text())
    .then((xmlResult) => {
      return xml2JsonArray(xmlResult);
    });
}

export function fetchRouteLocations(route, time = 0) {
  const tag = route.tag;

  return f(`http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=sf-muni&r=${tag}&t=${time}`)
    .then(result => result.text())
    .then((xmlResult) => {
      const buses = xml2JsonArray(xmlResult);
      const result = Object.assign({}, route, {
        buses,
      });

      return result;
    });
}

