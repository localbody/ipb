<?php

// Роутер
    function route($method, $urlData, $formData)
{

    // получаем техсостояние оборудования объекта, ЗА СЕГОДНЯ по коду объекта и коду типа оборудования
    // GET api/equipment/{objectID}/{equipmentTypeID}
    if ($method === 'GET' && count($urlData) === 2) {
          // Получаем id, objectID, equipmentTypeID
          $objectID = $urlData[0];
          $equipmentTypeID = $urlData[1];

          // Вытаскиваем все данные по всем тегам
          $SQL = file_get_contents(__DIR__ . '\sql\equipment_current.sql');

          $result = getData($SQL, ['?objectID', '?equipmentTypeID'], [$objectID, $equipmentTypeID]);


          if (strlen($result[0]) == 0) {
              echo $result[1];
          } else {
              // Возвращаем ошибку
              header('HTTP/1.0 400 Bad Request');
              echo json_encode(array('error' => $result[0]));
          }
        return;
    }
    // получаем техсостояние оборудования объекта, по дате, по коду объекта и коду типа оборудования
    // GET api/equipment/{date}/{objectID}/{equipmentTypeID}
    elseif ($method === 'GET' && count($urlData) === 3) {
        // Получаем id, objectID, equipmentTypeID
        $date = $urlData[0];
        $objectID = $urlData[1];
        $equipmentTypeID = $urlData[2];

        // Вытаскиваем все данные по всем тегам
        $SQL = file_get_contents(__DIR__ . '\sql\equipment_by_date.sql');

        $result = getData($SQL, ['?date', '?objectID', '?equipmentTypeID'], [$date, $objectID, $equipmentTypeID]);

        if (strlen($result[0]) == 0) {
            echo $result[1];
        } else {
            // Возвращаем ошибку
            header('HTTP/1.0 400 Bad Request');
            echo json_encode(array('error' => $result[0]));
        }
        return;
    }

    // Возвращаем ошибку
    // header('HTTP/1.0 400 Bad Request');
    // echo json_encode(array(
    //     'error' => 'Bad Request'
    // ));

}