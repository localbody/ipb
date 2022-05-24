const body = document.querySelector('body')
const popup = document.querySelector('.popup')
const popupOpener = document.querySelector('.popup__opener')
const popupCloser = document.querySelector('.popup__closer')
const popupBody = document.querySelector('.popup__body')
const columnsExpanded = document.querySelector('.columns--expanded')
const showAllColumns = document.getElementById('showAllColumns')

if (columnsExpanded) {
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

  const onChangeExpanded = () => {
    if (columnsExpanded.hasAttribute('colspan')) {
      columnsExpanded.removeAttribute('colspan')
    } else {
      columnsExpanded.setAttribute('colspan', 5)
    }

    const tdExpanded = document.querySelectorAll('.td--expanded')
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

  showAllColumns.addEventListener('change', onChangeExpanded)
}

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
