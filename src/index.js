import {run} from '@cycle/xstream-run'
import {makeDOMDriver} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http'
import App from './components/App'

run(App, {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver()
})
