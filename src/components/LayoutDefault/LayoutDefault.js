import xs from 'xstream'
import {div} from '@cycle/dom'
import './LayoutDefault.styl'

export default function LayoutDefault({ DOM, HTTP }){
  function intent(dom){
    return
  }
  function model(actions){
    return
  }
  function view(state$){
    return DOM
  }
  return {DOM: view(model(intent(DOM))), HTTP}
}
