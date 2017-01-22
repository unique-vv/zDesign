import {run} from '@cycle/xstream-run'
import {makeDOMDriver} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http'
import Home from './routes/Home'
import Works from './routes/Works'

const routes = {
  '/': Home,
  '/works': Works,
}

function route(routes){
  return routes[location.hash.slice(1) || '/']
}

run(route(routes), {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver()
})
