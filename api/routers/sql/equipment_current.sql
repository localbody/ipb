-- ОПИСАНИЕ: получаем ТЕКУЩЕЕ техсостояние оборудования объекта, по коду объекта и коду типа оборудования

-- ПАРАМЕТРЫ:
-- @d1 - дата отчета - СЕГОДНЯ
-- @obekt -код объекта
-- @tip_oborud - коду типа оборудования

-- РЕЗУЛЬТАТ:
-- objectName - название объекта,  например "Чигиринская ГЭС"
-- equipmentdName - название оборудования,  например "Гидрогенератор"
-- equipmentID - код оборудования,  например "2"
-- stateName - название состояния оборудования, например "в резерве"
-- dateTimeStart - дата-время начала состояния оборудования, например "2022-05-16 08:51:00"
-- dateTimeEnd - дата-время завершения состояния оборудования, например "2022-05-16 23:51:00"

declare  @d1 datetime
declare  @obekt integer
declare  @tip_oborud integer
set @d1 = convert(datetime, GETDATE(), 104)
set @obekt = ?objectID
set @tip_oborud = ?equipmentTypeID
select
obekt.nazvanie as objectName,
tip_oborud.nazvanie as equipmentName,
oborud.tech_num as equipmentID,
sos_oborud.nazvanie as stateName,
ISNULL(
CONVERT(VARCHAR(10), a_sost_oborud.vremya_izm_sost, 104) + ' ' +
CONVERT(VARCHAR(5), a_sost_oborud.vremya_izm_sost, 108), '') as dateTimeStart,
ISNULL(
CONVERT(VARCHAR(10), a_sost_oborud.plan_vremya_izm_sost, 104) + ' ' +
CONVERT(VARCHAR(5), a_sost_oborud.plan_vremya_izm_sost, 108), '') as dateTimeEnd
from (select max(a_sost_oborud.vremya_izm_sost) as max_vremya, a_sost_oborud.oborud as oborud
      from a_sost_oborud
      join oborud on a_sost_oborud.oborud= oborud.cod
      where (oborud.obekt = @obekt) and (oborud.tip_oborud = @tip_oborud) and (a_sost_oborud.vremya_izm_sost<= @d1)
      group by a_sost_oborud.oborud) a_max, a_sost_oborud
join sos_oborud on a_sost_oborud.sost_oborud= sos_oborud.cod
join oborud on a_sost_oborud.oborud= oborud.cod
join tip_oborud on oborud.tip_oborud= tip_oborud.cod
join obekt on oborud.obekt= obekt.cod
where ((a_sost_oborud.oborud= a_max.oborud) and (vremya_izm_sost= a_max.max_vremya)) and  sos_oborud.cod<>17
group by obekt.nazvanie, tip_oborud.nazvanie, oborud.tech_num,sos_oborud.nazvanie,a_sost_oborud.vremya_izm_sost,
          a_sost_oborud.plan_vremya_izm_sost
