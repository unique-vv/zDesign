import xs from 'xstream'
import {div, a, img} from '@cycle/dom'
import './Works.styl'

export default function Works({DOM, HTTP, isShowContact}){
  function querys(){
    const result = {}
    if(location.search.length > 1){
      location.search.slice(1).split('&').forEach((q) => {
        const qs = q.split('=')
        result[qs[0]] = qs[1] || true
      })
    }
    return result
  }
  function intent(domSource){
    return {
      work: HTTP.select('works').flatten()
        .map((res) => res.body.filter((w) => w.id === querys().workid)[0]),
      isShowContact: domSource.select('.contact>.handle')
        .events('click')
        .subscribe({
          next(){
            isShowContact.shamefullySendNext(true)
          }
        })
    }
  }
  function model(actions){
    return xs.combine(
      actions.work,
    ).map(([work]) => {
      return {
        work,
      }
    })
  }
  function view(state$){
    return state$.map(({work}) =>
      div('.route-works', [
        div('.head', [
          div('.inner', [
            div('.projects', [
              a('ALL PROJECTS'),
              a('< PREV PROJECTS'),
              a('NEXT PROJECTS >'),
            ]),
            div('.img1', [
              img({attrs: {src: work.img1}})
            ])
          ])
        ]),
        div('.body', [
          div('.inner', [
            div('.img2', [
              img({attrs: {src: work.img2}})
            ]),
            div('.img3', [
              img({attrs: {src: work.img3}})
            ]),
            div('.contact', [
              a('.handle', '与 我 联 系')
            ]),
            div('.foot', [
              div('.projects', [
                a('ALL PROJECTS'),
                a('< PREV PROJECTS'),
                a('NEXT PROJECTS >'),
              ]),
            ])
          ])
        ])
      ])
    )
  }
  return {
    DOM: view(model(intent(DOM))),
    HTTP: xs.of({
      url: '/json/works.json',
      category: 'works'
    }),
  }
}
