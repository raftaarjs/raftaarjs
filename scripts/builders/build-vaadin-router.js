function iterateRouter(routerObj, importsDir) {
  let routes = '';

  routerObj.forEach((route) => {
    if (route.redirect) {
      routes += `{ path: '${route.path}', redirect: '${route.redirect}'},`;
    } else {
      routes += `{ path: '${route.path}', action: () => dimport('${importsDir}${route.component}.js'), component: '${route.component}'},`;
    }
  });

  return routes;
}

function processRouter(routerObj, importsDir = './components/') {
  return Promise.resolve(`[
    ${iterateRouter(routerObj, importsDir)}
  ]`);
}

module.exports = { processRouter };
