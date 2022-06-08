function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function dateFormat(date, format = 'YYYYMMDD') {
  let result = ''
  if (format == 'YYYYMMDD') {
    result =
      date.getFullYear().toString() +
      '-' +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      date.getDate().toString().padStart(2, '0')
  } else if (format == 'DDMMYYYY') {
    result =
      date.getDate().toString().padStart(2, '0') +
      '.' +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      '.' +
      date.getFullYear().toString()
  }
  return result
}

document.addEventListener('DOMContentLoaded', documentReady)

function documentReady() {
  document.firstElementChild.style.zoom = 'reset'

  // при скроле
  window.addEventListener('scroll', () => {
    setPositionToggleFullScreen()
  })

  // при изменении размера и ориентации
  window.addEventListener('resize', () => {
    setPositionToggleFullScreen()
  })

  const mobileDetect = new MobileDetect(window.navigator.userAgent)
  const isMobile = Boolean(
    mobileDetect.tablet() || mobileDetect.mobile() || mobileDetect.phone()
  )

  const body = document.querySelector('body')
  const popup = document.querySelector('.popup')
  const popupOpener = document.querySelector('.popup__opener')
  const popupCloser = document.querySelector('.popup__closer')
  const popupBody = document.querySelector('.popup__body')
  const columnsExpandedItems = document.querySelectorAll('.columns--expanded')
  const showAllColumnsCheckbox = document.querySelectorAll(
    '.show-all-columns__checkbox'
  )
  const userAgent = navigator.userAgent.toLowerCase()
  const Mozila = /firefox/.test(userAgent)
  const Chrome = /chrome/.test(userAgent)
  const Safari = /safari/.test(userAgent)
  const Opera = /opera/.test(userAgent)

  // если найдем input[type='date'] - для firefox добавим required - это скроет кнопку отмены ввода даты
  if (true) {
    const dateInputs = document.querySelectorAll('input[type="date"]')
    dateInputs.forEach((dateInput) => {
      dateInput.setAttribute('required', true)
    })
  }

  const toggleFullScreen = document.querySelector('#toggleFullScreen')

  if (toggleFullScreen) {
    if (isMobile) {
      // покажем кнопку для fullscreen
      toggleFullScreen.style.display = 'block'
    }

    function setPositionToggleFullScreen() {
      toggleFullScreen.style.position = 'fixed'
      toggleFullScreen.style.top =
        document.documentElement.clientHeight -
        toggleFullScreen.clientHeight -
        parseInt(getComputedStyle(document.querySelector('body')).fontSize) /
          2 +
        'px'

      toggleFullScreen.style.left =
        document.documentElement.clientWidth -
        toggleFullScreen.clientWidth -
        parseInt(getComputedStyle(document.querySelector('body')).fontSize) /
          2 +
        'px'
    }

    setPositionToggleFullScreen()

    toggleFullScreen.addEventListener('click', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        document.documentElement.requestFullscreen()
      }
    })
  }

  // пробежим по списку "свернутых" колонок в таблицах и скроем их
  columnsExpandedItems.forEach((columnsExpanded) => {
    // найдем колонки для скрытия/открытия

    const table = columnsExpanded.closest('table')
    const tBody = table.querySelector('tbody')
    let columnsExpandedList = []

    table.querySelectorAll('tr').forEach((tr, indexTr) => {
      // пройдем по первой строке

      if (indexTr === 0) {
        tr.querySelectorAll('td').forEach((td, indexTd) => {
          if (td.classList.contains('columns--expanded')) {
            // смотрим сколько collspan

            td.dataset['columns']
              .split(',')
              .forEach((item) => columnsExpandedList.push(parseInt(item)))
          }
        })
      }
    })

    // пробежим по tbody и скроем ячейки у колонок из columnsExpandedList
    tBody.querySelectorAll('tr').forEach((tr, indexTr) => {
      tr.querySelectorAll('td').forEach((td, indexTd) => {
        if (columnsExpandedList.includes(indexTd)) td.classList.add('hide')
      })
    })
  })

  const onChangeShowAllCheckbox = (event) => {
    const table = event.target.closest('table')

    const columnsExpanded = table.querySelector('.columns--expanded')
    const tBody = table.querySelector('tbody')

    let columnsExpandedList = []
    table.querySelectorAll('tr').forEach((tr, indexTr) => {
      // пройдем по первой строке
      if (indexTr === 0) {
        tr.querySelectorAll('td').forEach((td, indexTd) => {
          if (td.classList.contains('columns--expanded')) {
            // смотрим сколько collspan
            td.dataset['columns']
              .split(',')
              .forEach((item) => columnsExpandedList.push(parseInt(item)))
          }
        })
      }
    })

    if (columnsExpanded.hasAttribute('colspan')) {
      columnsExpanded.removeAttribute('colspan')
    } else {
      columnsExpanded.setAttribute('colspan', columnsExpandedList.length + 1)
    }

    const tdExpanded = table.querySelectorAll('.td--expanded')
    tdExpanded.forEach((td) => td.classList.toggle('hide'))

    // пробежим по tbody и скроем/покажем ячейки у колонок из columnsExpandedList
    tBody.querySelectorAll('tr').forEach((tr, indexTr) => {
      tr.querySelectorAll('td').forEach((td, indexTd) => {
        if (columnsExpandedList.includes(indexTd)) {
          td.classList.toggle('hide')
        }
      })
    })
  }

  showAllColumnsCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change', onChangeShowAllCheckbox)
  })

  if (popupOpener) {
    popupOpener.addEventListener('click', (event) => {
      event.stopPropagation()
      popup.classList.add('popup--open')
      body.classList.add('noscroll')
      document.addEventListener(
        'keydown',
        (event) => {
          if (event.key == 'Escape') popupClose()
        },
        {once: true}
      )
    })
  }

  const popupClose = () => {
    popup.classList.remove('popup--open')
    body.classList.remove('noscroll')
  }

  if (popupBody) {
    popupBody.addEventListener('click', (event) => {
      if (!event.target.closest('.popup__content')) popupClose()
    })
  }

  if (popupCloser) {
    popupCloser.addEventListener('click', () => {
      popupClose()
    })
  }
}
