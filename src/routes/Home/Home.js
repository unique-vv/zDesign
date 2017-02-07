import xs from 'xstream'
import {div, input, br, a, img} from '@cycle/dom'
import './Home.styl'
import LayoutDefault from '../../components/LayoutDefault'
import throttle from 'xstream/extra/throttle'

export default function Home({DOM, HTTP}){
  function bricks(box, cols, space){
    space = space || 0
    box.childNodes.forEach((c, i) => {
      c.style.width = (box.offsetWidth - (cols - 1) * space) / cols + 'px'
      if(i % cols){
        c.style.marginLeft = space + 'px'
      }else{
        c.style.marginLeft = 0
      }
    })
  }
  function match(el, selector){
    if(selector[0] === '#'){
      return el.id === selector.slice(1)
    }else if(selector[0] === '.'){
      return el.className.includes(selector.slice(1))
    }
  }
  function parentNode(el, selector){
    if(el === document){
      return null
    }
    if(match(el, selector)){
      return el
    }
    return parentNode(el.parentNode, selector)
  }
  DOM.select('.works')
    .elements()
    .filter((el) => el.length)
    .take(1)
    .subscribe({
      next(el){
        bricks(el[0], 3, 20)
      }
    })
  function intent(domSource){
    return {
      changeScreen: domSource.select('.route-home')
        .events('mousewheel')
        .filter((ev) => {
          if(ev.deltaY === 0){
            return
          }
          const screen = parentNode(ev.target, '.screen')
          if(screen){
            if(ev.deltaY > 0){
              return screen.scrollTop === screen.scrollHeight - screen.clientHeight
            }else if(ev.deltaY < 0){
              return screen.scrollTop === 0
            }
          }
          return true
        })
        .compose(throttle(1500))
        .map((ev) => ev.deltaY > 0 ? 1 : -1)
        .fold((acc, x) => {
          if(acc === 1 && x === -1 || acc === 4 && x === 1){
            return acc
          }
          return acc + x
        }, 1),
      playSprite: xs.periodic(125).map((i) => i % 15),
      works: HTTP.select('works').flatten()
        .map((res) => res.body)
    }
  }
  function model(actions){
    return xs.combine(
      actions.changeScreen,
      actions.playSprite,
      actions.works,
    ).map(([screenIndex, spriteIndex, works]) => {
      return {
        screenIndex,
        spriteIndex,
        works,
      }
    })
  }
  function view(state$){
    return state$.map(({screenIndex, spriteIndex, works}) =>
      div('.route-home', {attrs: {screenIndex: screenIndex || 1}}, [
        div('.ctrls', [
          div('.ctrl.ctrl1'),
          div('.ctrl.ctrl2'),
          div('.ctrl.ctrl3'),
          div('.ctrl.ctrl4'),
        ]),
        div('.screens', [
          div('.screen.screen1', [
            div('.inner', [
              div('.sprite', {style: {backgroundPosition: `-${476 * spriteIndex}px 0`}}),
              div('.content', [
                div('.welcome', 'WELCOME TO THE WORLD OF'),
                div('.owner', '小曾＆爱德狗'),
                div('.career', 'UI • ILLUSTRATION • UE'),
                div('.story', [
                  '两个冒险家加上一猫一狗的世界，开始一段无尽探索历程。',
                  br(),
                  '摊在沙发的小曾，抓娃娃的爱德狗，偷吃小鱼干的小可，拉屎最臭的狗蛋…',
                  br(),
                  '开开心心每一天。寻找新的方法一直前进着…',
                ]),
                a('.explore', '探 索 世 界')
              ])
            ])
          ]),
          div('.screen.screen2', [
            div('.inner', [
              div('.experience', [
                div([
                  div('.year', '1991'),
                  div('.place', [
                    '出生于', br(), '江西省南昌市',
                    div('.thing', '勇士小曾来到新手村')
                  ])
                ]),
                div([
                  div('.year', '2014'),
                  div('.place', [
                    '毕业于', br(), '复旦大学上海视觉艺术学院', br(), '动画专业 本科',
                    div('.thing', '走出新手村')
                  ])
                ]),
                div([
                  div('.year', '2014'),
                  div('.place', [
                    '上海电视台子午工作室',
                    div('.thing', '第一个主线任务完成')
                  ])
                ]),
                div([
                  div('.year', '2015'),
                  div('.place', [
                    '金扳手科技', br(), '（均瑶集团）',
                    div('.thing', '第二个主线任务完成')
                  ])
                ]),
              ]),
              div('.sprite', {style: {backgroundPosition: `-${270 * spriteIndex}px 0`}})
            ])
          ]),
          div('.screen.screen3', [
            div('.inner', [
              div('.content', [
                div('.name', '曾晨阳 OWEN TSANG'),
                div('.title', 'UI设计师'),
                div('.intro', 'Hey,我是小曾。深厚的美术基础，优秀的审美修养，多年设计经验。上可出原型，下可做UI，中间还能做UE、动画、手绘。历经八十一难，具备七十二变。'),
                div('.goodat', [
                  '我擅长于',
                  div('.skills', [
                    div('UX'),
                    div('Sketch'),
                    div('PS'),
                    div('AI'),
                  ])
                ]),
              ])
            ])
          ]),
          div('.screen.screen4', [
            div('.inner', [
              div('.title', 'SELECTED WORK'),
              div('.filter', [
                a('ALL'),
                a('WEB'),
                a('MOBILE'),
                a('TABLET'),
                a('OTHERS'),
              ]),
              div('.works', works.map((w) =>
                div([
                  img({attrs: {src: w.thumbnail}}),
                  div('.detail', [
                    div('.name', w.name),
                    a('.link', {attrs: {href: `?workid=${w.id}#/works`}}, '查 看 详 细')
                  ])
                ])
              ))
            ])
          ]),
        ])
      ])
    )
  }
  return LayoutDefault({
    DOM: view(model(intent(DOM))),
    HTTP: xs.of({
      url: '/json/works.json',
      category: 'works'
    }),
  })
}
