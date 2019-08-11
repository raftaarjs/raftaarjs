function processRouter(routerObj) {
  return Promise.resolve(`[
    ${iterateRouter(routerObj)}
  ]`);
}

function iterateRouter(routerObj) {
  let routes = ``;

  routerObj.forEach(route => {
    if (route.redirect) {
      routes += `{ path: '${route.path}', redirect: '${route.redirect}'},`;
    } else {
      routes += `{ path: '${route.path}', action: () => dimport('./components/${route.component}.js'), component: '${route.component}'},`;
    }
  });

  return routes;
}

module.exports = { processRouter };