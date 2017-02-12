import xs from 'xstream'
import {div, img} from '@cycle/dom'
import './App.styl'
import route from '../../routes'

import close from './xxx.png'
import tel from './tel.png'
import mail from './mail.png'
import qrcode from './qrcode_big.png'

export default function App({DOM, HTTP}){
  const isShowContact = xs.create().startWith(false)
  const page = route()({
    DOM,
    HTTP,
    isShowContact
  })
  function hasClass(el, className){
    return [].indexOf.call(el.classList, className) !== -1
  }
  function intent(domSource){
    DOM.select('.contactBox').events('click')
      .subscribe({
        next(ev){
          if(hasClass(ev.target, 'contactBox') || hasClass(ev.target, 'close')){
            isShowContact.shamefullySendNext(false)
          }
        }
      })
    return {
      domSource: page.DOM,
      isShowContact,
    }
  }
  function model(actions){
    return xs.combine(
      actions.domSource,
      actions.isShowContact,
    ).map(([domSource, isShowContact]) => {
      return {
        domSource,
        isShowContact,
      }
    })
  }
  function view(state$){
    return state$.map(({domSource, isShowContact}) =>
      div([
        domSource,
        div('.contactBox', {style: {display: isShowContact ? 'flex' : 'none'}}, [
          div('.inner', [
            img('.close', {attrs: {src: close}}),
            div('.tit', '联系方式'),
            div('.type', [
              img({attrs: {src: tel}}),
              'TEL:186-6586-8169'
            ]),
            div('.type', [
              img({attrs: {src: mail}}),
              'MAIL:18665868169@163.com'
            ]),
            div('.qr', [
              img({attrs: {src: qrcode}}),
              '扫一扫与我联系'
            ])
          ])
        ])
      ])
    )
  }
  return {DOM: view(model(intent(DOM))), HTTP: page.HTTP}
}
