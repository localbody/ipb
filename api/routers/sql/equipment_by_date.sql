-- ОПИСАНИЕ: получаем АРХИВНОЕ(НЕ за сегодня) техсостояние оборудования объекта, по дате, коду объекта и коду типа оборудования

-- ПАРАМЕТРЫ:
-- @d1 - дата отчета - НЕ СЕГОДНЯ!!!
-- @obekt -код объекта
-- @tip_oborud - коду типа оборудования

-- РЕЗУЛЬТАТ:
-- objectName - название объекта,  например "Чигиринская ГЭС"
-- equipmentName - название оборудования,  например "Гидрогенератор"
-- equipmentID - код оборудования,  например "2"
-- stateName - название состояния оборудования, например "в резерве"
-- dateTimeStart - дата-время начала состояния оборудования, например "2022-05-16 08:51:00"
-- dateTimeEnd - дата-время завершения состояния оборудования, например "2022-05-16 23:51:00"


declare  @d1 datetime
declare  @obekt integer
declare  @tip_oborud integer

set @d1 = convert(datetime, '?date', 104)
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
CONVERT(VARCHAR(5), a_sost_oborud.plan_vremya_izm_sost, 108), '') as dateTimeEnd,
oborud.sort_sost,
a_sost_oborud.vremya_izm_sost
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
union
select
obekt.nazvanie as objectName,
tip_oborud.nazvanie as oborudName,
oborud.tech_num as oborudID,
sos_oborud.nazvanie as stateName,
ISNULL(
CONVERT(VARCHAR(10), a_sost_oborud.vremya_izm_sost, 104) + ' ' +
CONVERT(VARCHAR(5), a_sost_oborud.vremya_izm_sost, 108), '') as dateTimeStart,
ISNULL(
CONVERT(VARCHAR(10), a_sost_oborud.plan_vremya_izm_sost, 104) + ' ' +
CONVERT(VARCHAR(5), a_sost_oborud.plan_vremya_izm_sost, 108), '') as dateTimeEnd,
oborud.sort_sost,
a_sost_oborud.vremya_izm_sost
from a_sost_oborud
join sos_oborud on a_sost_oborud.sost_oborud= sos_oborud.cod
join oborud on a_sost_oborud.oborud= oborud.cod
join tip_oborud on oborud.tip_oborud= tip_oborud.cod
join obekt on oborud.obekt= obekt.cod
where (oborud.obekt = @obekt) and (oborud.tip_oborud = @tip_oborud) and (sos_oborud.cod<>17)
and (a_sost_oborud.vremya_izm_sost>= @d1) and (a_sost_oborud.vremya_izm_sost< @d1+1)

order by oborud.sort_sost asc, a_sost_oborud.vremya_izm_sost desc
