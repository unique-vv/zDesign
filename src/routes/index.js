import Home from './Home'
import Works from './Works'

const routes = {
  '/': Home,
  '/works': Works,
}

export default function(){
  return routes[location.hash.slice(1) || '/']
}
