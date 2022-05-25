// console.log(window.innerWidth, window.outerWidth)

const today = new Date()
const todayYYYYMMDD = dateFormat(today)
let reportDate = new Date()
const linksObjectsLink = document.querySelectorAll('.links__objects-link')
const linksDateInput = document.querySelectorAll('.links__date-input')
const linksDateToday = document.querySelectorAll('.links__date-today')
const linksDatePlus = document.querySelectorAll('.links__date-plus')
const linksDateMinus = document.querySelectorAll('.links__date-minus')

// в инпутах выбора даты отчета
// установим сегодняшнюю дату
// установим максимальную дату = сегодня
linksDateInput.forEach((dateInput) => {
  dateInput.value = todayYYYYMMDD
  dateInput.max = todayYYYYMMDD
})

function updateReportDate() {
  linksDateInput.forEach((dateInput) => {
    dateInput.value = dateFormat(reportDate)
  })
}

function onClickDatePlus() {
  if (reportDate < today) {
    reportDate.setDate(reportDate.getDate() + 1)
    updateReportDate()
  }
}

function onClickDateMinus() {
  reportDate.setDate(reportDate.getDate() - 1)
  updateReportDate()
}

linksDateMinus.forEach((linksDateMinus) => {
  linksDateMinus.addEventListener('click', onClickDateMinus)
})

linksDatePlus.forEach((linksDatePlus) => {
  linksDatePlus.addEventListener('click', onClickDatePlus)
})

function onClickDateToday() {
  linksDateInput.forEach((dateInput) => {
    dateInput.value = todayYYYYMMDD
  })
}

linksDateToday.forEach((linkDateToday) => {
  linkDateToday.addEventListener('click', onClickDateToday)
})

function onClickLinkObject(event) {
  // скроем
  if (!event.target.classList.contains('links__objects-link--active')) {
    const activeObjectLink = document.querySelector(
      '.links__objects-link--active'
    )
    activeObjectLink.classList.remove('links__objects-link--active')
    event.target.classList.add('links__objects-link--active')
  }
}

linksObjectsLink.forEach((linkObjectsLink) => {
  linkObjectsLink.addEventListener('click', onClickLinkObject)
})
