const app = document.querySelector('#app')

const currentGlobal = chrome || browser

function historySearch(query, cb) {
  currentGlobal.history.search(query, cb)
}
let list = []
let pageSize = 50
let currentPage = 1
let isInitial = false
let historyList_el = null
let pagination_el = null

function initialPage(list, pageSize, currentPage) {
  if (isInitial) return
  isInitial = true
  const historyList = '<ul id="history-list"></ul>'
  const pagination = '<div id="pagination"></div>'
  document.querySelector('#app').innerHTML = historyList + pagination
  historyList_el = document.querySelector('#history-list')
  pagination_el = document.querySelector('#pagination')
  buildHistoryList(list, pageSize, currentPage)
  buildPagination(list, pageSize, currentPage)
}

function buildHistoryList(list, pageSize, currentPage) {
  let innerList = ''
  if (list.length > 0) {
    innerList = list.slice(currentPage - 1, currentPage * pageSize + 1).map(e => {
      const date = new Date(e.lastVisitTime)
      return `<li class='flex-wrap'>
        <b class='flex-none' style='width:50px;'>${e.visitCount}/${e.typedCount}</b>
        <a style='flex:1;padding-right:20px' href='${e.url}'>${e.title}</a>
        <span class='flex-none'>${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}</span>
      </li>`
    }).join('')
  }
  if (historyList_el) historyList_el.innerHTML = innerList
}

function buildPagination(list, pageSize, currentPage) {
  if (pagination_el) {
    let pages = (list.length - list.length % pageSize) / pageSize
    if (list.length % pageSize !== 0) pages += 1
    pagination_el.innerHTML = `
      <button class='left'><</button><button class='right'>></button>
      current: <b>${currentPage}</b>
      size: <b>${pageSize}</b>
      page: <b>${pages}</b>
      total: <b>${list.length}</b>
    `
  }
}
// https://www.google.com/s2/favicons?domain=baidu.com

// historySearch({
//   text: ""
// },function(results){
//   if(results.length>0){
//     list = results
//     total = list.length
//     initialPage(list,pageSize,currentPage)
//   }
// })

calendar = new FullCalendar.Calendar(app, {
  initialView: 'dayGridMonth',
  height: '100%',
  headerToolbar: {
    left: "prevYear,prev,next,nextYear,today",
    right: 'title'
  },
  titleFormat: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  },
  eventContent(args){
    console.warn('eventContent',args)
    const div1 = document.createElement('div')
    div1.innerText = args.event.title
    let arrayOfDomNodes = [ div1 ]
    return { domNodes: arrayOfDomNodes }
  }
});

function updateHistory(results,start,end,cb){
  const time = 24*60*60*1000
  let newResult = {}
  let innerStart= start
  let innerEnd= 0
  const run = function(){
    if(innerEnd<end){
      innerEnd = innerStart+time
      newResult[innerStart] = results.filter(({lastVisitTime})=>lastVisitTime>=innerStart && lastVisitTime<innerEnd)
      cb(innerStart,newResult[innerStart])
      innerStart+=time
      setTimeout(run,0)
    }else{
      // cb(newResult)
    }
  }
  run()
}


calendar.on('datesSet', function (e) {
  historySearch({
    text: "",
    startTime: calendar.view.currentStart.getTime(),
    endTime: calendar.view.currentEnd.getTime(),
    maxResults: 1000000
  }, function (results) {
    for(e of calendar.getEvents()){ e.remove()}
    updateHistory(
      results,
      calendar.view.currentStart.getTime(),
      calendar.view.currentEnd.getTime(),
      function(time,data){
        console.warn('xxxxxxxxxxxxxxxxccccccccc',time, data)
        calendar.addEvent({
          id: time,
          title: data.length,
          start: time,
          end: time,
          data
        })
      })
    // console.warn('xxxxxxxxxxxxxxxx', results)
    // for(e of calendar.getEvents()){ e.remove()}
    // calendar.addEvent({
    //   id: 'test',
    //   title: 'The Title',
    //   start: '2020-08-14',
    //   end: '2020-08-14'
    // })
  })
})
// console.warn('xxxxxxxxxxxxxxxxccc', calendar)
calendar.render();