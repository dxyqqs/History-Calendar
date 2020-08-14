document.querySelector('#app').innerText = '111111111111'

const currentGlobal = chrome || browser

function historySearch(query,cb){
  currentGlobal.history.search(query,cb)
}
let list = []
let pageSize = 50
let currentPage = 1
let isInitial = false
let historyList_el = null
let pagination_el = null

function initialPage(list,pageSize,currentPage){
  if(isInitial) return
  isInitial = true
  const historyList = '<ul id="history-list"></ul>'
  const pagination = '<div id="pagination"></div>'
  document.querySelector('#app').innerHTML = historyList+pagination
  historyList_el =  document.querySelector('#history-list')
  pagination_el =  document.querySelector('#pagination')
  buildHistoryList(list,pageSize,currentPage)
  buildPagination(list,pageSize,currentPage)
}

function buildHistoryList(list,pageSize,currentPage){
  let innerList = ''
  if(list.length>0){
    innerList = list.slice(currentPage-1,currentPage*pageSize+1).map(e=>{
      const date = new Date(e.lastVisitTime)
      return `<li class='flex-wrap'>
        <b class='flex-none' style='width:50px;'>${e.visitCount}/${e.typedCount}</b>
        <a style='flex:1;padding-right:20px' href='${e.url}'>${e.title}</a>
        <span class='flex-none'>${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}</span>
      </li>`
    }).join('')
  }
  if(historyList_el) historyList_el.innerHTML = innerList
}

function buildPagination(list,pageSize,currentPage){
  if(pagination_el) {
    let pages = ( list.length - list.length % pageSize) / pageSize
    if(list.length % pageSize!==0) pages+=1
    pagination_el.innerHTML = `
      <button class='left'><</button><button class='right'>></button>
      current: <b>${currentPage}</b>
      size: <b>${pageSize}</b>
      page: <b>${pages}</b>
      total: <b>${list.length}</b>
    `
  }
}

// historySearch({
//   text: ""
// },function(results){
//   if(results.length>0){
//     list = results
//     total = list.length
//     initialPage(list,pageSize,currentPage)
//   }
// })


var calendar = tui(document.getElementById('app'), {
  defaultView: 'week',
  taskView: true,    // Can be also ['milestone', 'task']
  scheduleView: true,  // Can be also ['allday', 'time']
  template: {
      milestone: function(schedule) {
          return '<span style="color:red;"><i class="fa fa-flag"></i> ' + schedule.title + '</span>';
      },
      milestoneTitle: function() {
          return 'Milestone';
      },
      task: function(schedule) {
          return '&nbsp;&nbsp;#' + schedule.title;
      },
      taskTitle: function() {
          return '<label><input type="checkbox" />Task</label>';
      },
      allday: function(schedule) {
          return schedule.title + ' <i class="fa fa-refresh"></i>';
      },
      alldayTitle: function() {
          return 'All Day';
      },
      time: function(schedule) {
          return schedule.title + ' <i class="fa fa-refresh"></i>' + schedule.start;
      }
  },
  month: {
      daynames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      startDayOfWeek: 0,
      narrowWeekend: true
  },
  week: {
      daynames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      startDayOfWeek: 0,
      narrowWeekend: true
  }
});
console.warn(tui)