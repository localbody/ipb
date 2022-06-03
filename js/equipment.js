document.addEventListener('DOMContentLoaded', () => {
  const today = new Date()
  const todayYYYYMMDD = dateFormat(today)
  let reportDate = new Date() // за какую дату данные
  let objectsList = 'ТЭЦ-21, ТЭЦ-22' // для каких объектов данные
  const apiURL = 'http://energy13.mogilev.energo.net/ipb/api/equipment/'
  const linksObjectsLink = document.querySelectorAll('.links__objects-link')
  const linksDateInput = document.querySelectorAll('.links__date-input')
  const linksDateToday = document.querySelectorAll('.links__date-today')
  const linksDatePlus = document.querySelectorAll('.links__date-plus')
  const linksDateMinus = document.querySelectorAll('.links__date-minus')
  const objectsLog = document.querySelector('.objects__log')

  const STATUS = {
    'аварийный ремонт': 'repair',
    'в работе': 'work',
    'в резерве': 'reserve',
    'в ремонте': 'repair',
    'вне резерва': 'notinreserve',
    'все в резерве': 'reserve',
    'две в работе': 'work',
    'капитальный ремонт': 'repair',
    'на консервации': 'conservation',
    'неотложный ремонт': 'repair',
    'неплановый ремонт': 'repair',
    'одна в работе': 'work',
    'средний ремонт': 'repair',
    'текущий ремонт': 'repair',
    'три в работе': 'work',
    'четыре в работе': 'work',
    демонтирован: 'demount',
  }

  // обновить данные на странице
  function refreshEquipmentPage() {
    // скрываем все '.object'
    const objectItems = document.querySelectorAll('.object')
    objectItems.forEach((item) => {
      item.remove()
    })
    // показываем загрузку данных
    objectsLog.removeAttribute('hidden')

    const divObjects = document.querySelector('.objects')

    function addObject(objectTitle, objectID, equipmentsList) {
      // создаем '.object'
      const divObject = document.createElement('div')
      divObject.classList.add('object', 'object--show')
      divObjects.insertAdjacentElement('beforeend', divObject)

      const h2ObjectTitle = document.createElement('h2')
      h2ObjectTitle.classList.add('object__title')
      h2ObjectTitle.innerText = objectTitle
      divObject.insertAdjacentElement('beforeend', h2ObjectTitle)
      //
      const divEquipmentsItems = document.createElement('div')
      divEquipmentsItems.classList.add('equipments-items')

      if (equipmentsList.length === 1) {
        divEquipmentsItems.classList.add('equipments-items--one-columns')
      } else if (equipmentsList.length === 2) {
        divEquipmentsItems.classList.add('equipments-items--two-columns')
      } else {
        divEquipmentsItems.classList.add('equipments-items--three-columns')
      }

      divObject.insertAdjacentElement('beforeend', divEquipmentsItems)

      equipmentsList.forEach((item) => {
        const equipmentsTitle = capitalize(item.equipmentsName)
        const divEquipments = document.createElement('div')
        divEquipments.classList.add('equipments')
        divEquipmentsItems.insertAdjacentElement('beforeend', divEquipments)
        //
        const spanEquipmentsTitle = document.createElement('span')
        spanEquipmentsTitle.classList.add('equipments__title')
        spanEquipmentsTitle.innerHTML = `<span class="equipments__title-object">${objectTitle}.</span><span>${equipmentsTitle}</span><div class="loader loader--equipments"><div></div><div></div><div></div></div>`
        divEquipments.insertAdjacentElement('beforeend', spanEquipmentsTitle)
        //
        const divEquipmentsHeader = document.createElement('div')
        divEquipmentsHeader.classList.add('equipments__header')
        divEquipmentsHeader.innerHTML = '<span>№</span><span>Состояние</span>'
        divEquipments.insertAdjacentElement('beforeend', divEquipmentsHeader)
        //

        // если отчет за "НЕ СЕГОДНЯ"
        let paramDateReport = ''
        if (dateFormat(reportDate) != dateFormat(today)) {
          paramDateReport = dateFormat(reportDate, 'DDMMYYYY') + '/'
        }

        fetch(apiURL + paramDateReport + objectID + '/' + item.equipmentsList)
          .then((response) => {
            return response.json()
          })
          .then((data) => {
            data.forEach((item) => {
              const divEquipment = document.createElement('div')
              divEquipment.classList.add(
                'equipment',
                'equipment--status-' + STATUS[item.statusName]
              )

              // если смотрим ТЕКУЩЕЕ СОСТОЯНИЕ
              // костыль: нужно проверить что дата окончания состояния не меньше текущей даты и времени
              // если меньше - то это просроченное состояние - пометим его .equipment--status-overdue
              if (
                item.dateTimeEnd != '' &&
                dateFormat(reportDate) == dateFormat(today)
              ) {
                const dateTimeEnd = new Date()
                dateTimeEnd.setYear(item.dateTimeEnd.substr(6, 4))
                dateTimeEnd.setMonth(item.dateTimeEnd.substr(3, 2) - 1)
                dateTimeEnd.setDate(item.dateTimeEnd.substr(0, 2))
                dateTimeEnd.setHours(item.dateTimeEnd.substr(11, 2))
                dateTimeEnd.setMinutes(item.dateTimeEnd.substr(14, 2))
                dateTimeEnd.setSeconds(0)

                if (dateTimeEnd.getTime() < today.getTime()) {
                  divEquipment.classList.add('equipment--status-overdue')
                }
              }

              divEquipment.innerHTML = `<div class="equipment__id">
                                          <span class="equipment__id-text">${
                                            item.equipmentID
                                          }</span>
                                        </div>
                                        <div class="equipment__status">
                                          <span class="equipment__status-text">${
                                            item.statusName
                                          }</span>
                                          <div class="equipment__status-period">
                                            <div class="equipment__status-start">
                                              <span class="date">${item.dateTimeStart.substr(
                                                0,
                                                10
                                              )}</span>
                                              <span class="hour-minutes">${item.dateTimeStart.substr(
                                                -5
                                              )}</span>
                                            </div>
                                            <span class="equipment--period-arrow"></span>
                                            <span class="equipment__status-end">
                                              <span class="date">${item.dateTimeEnd.substr(
                                                0,
                                                10
                                              )}</span>
                                              <span class="hour-minutes">${item.dateTimeEnd.substr(
                                                -5
                                              )}</span>
                                            </span>
                                          </div>
                                        </div>`
              divEquipments.insertAdjacentElement('beforeend', divEquipment)
              divEquipments
                .querySelector('.loader')
                .classList.add('transparent')
            })
          })
          .catch(() => {})
      })
    }

    function wrapLastTwoEquipment() {
      // костыль - обернем два последних блока .equipments-items в wrapper
      const equipmentsItemsList = document.querySelectorAll('.equipments-items')
      equipmentsItemsList.forEach((item) => {
        const equipmentsList = item.querySelectorAll('.equipments')

        const equipmentsPenultimate = equipmentsList[equipmentsList.length - 2]
        const equipmentsLast = equipmentsList[equipmentsList.length - 1]

        equipmentsPenultimate.remove()
        equipmentsLast.remove()

        const divWrapper = document.createElement('div')
        divWrapper.classList.add('wrapper')
        divWrapper.classList.add('wrapper--equipments')

        divWrapper.insertAdjacentElement('beforeend', equipmentsPenultimate)
        divWrapper.insertAdjacentElement('beforeend', equipmentsLast)
        item.insertAdjacentElement('beforeend', divWrapper)
      })
    }

    divObjects.classList.remove('objects--two-objects')
    divObjects.classList.remove('objects--three-objects')

    if (objectsList == 'ТЭЦ-21, ТЭЦ-22') {
      // сделаем два объекта на одной странице
      divObjects.classList.add('objects--two-objects')
      addObject('ТЭЦ-21', 1, [
        {equipmentsName: 'котлы паровые', equipmentsList: '1'},
        {equipmentsName: 'турбогенераторы', equipmentsList: '3'},
        {
          equipmentsName: 'котлы водогрейные и электродные',
          equipmentsList: '2,12',
        },
      ])
      addObject('ТЭЦ-22', 2, [
        {equipmentsName: 'котлы паровые', equipmentsList: '1'},
        {equipmentsName: 'турбогенераторы', equipmentsList: '3'},
        {
          equipmentsName: 'котлы водогрейные и электродные',
          equipmentsList: '2,12',
        },
      ])
    } else if (objectsList == 'ТЭЦ-6, ТЭЦ-27') {
      // сделаем два объекта на одной странице
      //
      divObjects.classList.add('objects--two-objects')
      addObject('ТЭЦ-6', 3, [
        {equipmentsName: 'котлы паровые', equipmentsList: '1,13'},
        {equipmentsName: 'турбогенераторы', equipmentsList: '3'},
        {equipmentsName: 'газотурбинные установки', equipmentsList: '6'},
        {
          equipmentsName: 'котлы водогрейные',
          equipmentsList: '2',
        },
      ])
      addObject('ТЭЦ-27', 7, [
        {equipmentsName: 'котлы паровые', equipmentsList: '1,13'},
        {equipmentsName: 'турбогенераторы', equipmentsList: '3'},
        {equipmentsName: 'газотурбинные установки', equipmentsList: '6'},
        {
          equipmentsName: 'котлы водогрейные',
          equipmentsList: '2',
        },
      ])
      // костыль - обернем два последних блока .equipments-items в wrapper
      // если экран больше 1440
      if (window.innerWidth > 1440) {
        wrapLastTwoEquipment()
      }
    } else if (objectsList == 'ТЭЦ-9, ОТЭЦ') {
      // сделаем два объекта на одной странице
      divObjects.classList.add('objects--two-objects')
      addObject('ТЭЦ-9', 4, [
        {equipmentsName: 'котлы паровые', equipmentsList: '1'},
        {equipmentsName: 'турбогенераторы', equipmentsList: '3'},
      ])
      addObject('ОТЭЦ', 9, [
        {equipmentsName: 'котлы паровые', equipmentsList: '1'},
        {equipmentsName: 'турбогенераторы', equipmentsList: '3'},
        {
          equipmentsName: 'котлы водогрейные',
          equipmentsList: '2',
        },
      ])
    } else if (objectsList == 'РК-1, РК-2, КРТС') {
      // сделаем три объекта на одной странице
      divObjects.classList.add('objects--three-objects')
      addObject('РК-1', 5, [
        {equipmentsName: 'котлы паровые и водогрейные', equipmentsList: '1, 2'},
      ])
      addObject('РК-2', 6, [
        {equipmentsName: 'котлы паровые и водогрейные', equipmentsList: '1, 2'},
      ])
      addObject('КРТС', 30, [
        {
          equipmentsName: 'котлы водогрейные и электродные',
          equipmentsList: '2,12',
        },
      ])
    } else if (objectsList == 'ОГЭС, ТГЭС, ЧГЭС') {
      // сделаем один объект на одной странице
      divObjects.classList.add('objects--three-objects')
      addObject('ОГЭС', 11, [
        {equipmentsName: 'гидрогенераторы', equipmentsList: '4'},
      ])
      addObject('ТГЭС', 12, [
        {equipmentsName: 'гидрогенераторы', equipmentsList: '4'},
      ])
      addObject('ЧГЭС', 13, [
        {equipmentsName: 'гидрогенераторы', equipmentsList: '4'},
      ])
    }

    // прячем загрузку данных
    objectsLog.setAttribute('hidden', false)
    // отрисовываем .object
    objectItems.forEach((item) => {
      item.classList.add('object--show')
    })
  }

  refreshEquipmentPage()

  // в инпутах выбора даты отчета
  // установим сегодняшнюю дату
  // установим максимальную дату = сегодня
  linksDateInput.forEach((dateInput) => {
    dateInput.value = todayYYYYMMDD
    dateInput.max = todayYYYYMMDD

    function onChangeDateInput(event) {
      const stringDateValue = event.target.value

      const milliseconds = Date.parse(stringDateValue)
      if (isNaN(milliseconds) || milliseconds < 0) {
        reportDate = new Date()
      } else {
        reportDate = new Date(Date.parse(stringDateValue))
      }
      // console.log(stringDateValue, Date.parse(stringDateValue), reportDate)
      updateReportDate()
      refreshEquipmentPage()
    }

    dateInput.addEventListener('change', onChangeDateInput)
  })

  function updateReportDate() {
    linksDateInput.forEach((dateInput) => {
      dateInput.value = dateFormat(reportDate)
    })
    // обновим подсветку кнопки "текущее состояние"
    if (dateFormat(reportDate) == dateFormat(today)) {
      linksDateToday.forEach((item) => {
        item.classList.add('links__date-today--active')
      })
    } else {
      linksDateToday.forEach((item) => {
        item.classList.remove('links__date-today--active')
      })
    }

    refreshEquipmentPage()
  }

  linksDateMinus.forEach((linksDateMinus) => {
    function onClickDateMinus() {
      reportDate.setDate(reportDate.getDate() - 1)
      updateReportDate()
    }
    linksDateMinus.addEventListener('click', onClickDateMinus)
  })

  linksDatePlus.forEach((linksDatePlus) => {
    function onClickDatePlus() {
      if (reportDate < today) {
        reportDate.setDate(reportDate.getDate() + 1)
        updateReportDate()
      }
    }
    linksDatePlus.addEventListener('click', onClickDatePlus)
  })

  linksDateToday.forEach((linkDateToday) => {
    function onClickDateToday() {
      reportDate = new Date()
      updateReportDate()
    }
    linkDateToday.addEventListener('click', onClickDateToday)
  })

  linksObjectsLink.forEach((linkObjectsLink) => {
    function onClickLinkObject(event) {
      // скроем активный
      if (!event.target.classList.contains('links__objects-link--active')) {
        const activeObjectLink = document.querySelector(
          '.links__objects-link--active'
        )

        objectsList = event.target.innerText
        activeObjectLink.classList.remove('links__objects-link--active')
        event.target.classList.add('links__objects-link--active')
      }
      // обновим данные на странице
      refreshEquipmentPage()
    }
    linkObjectsLink.addEventListener('click', onClickLinkObject)
  })
})
