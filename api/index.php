<?php

function toWIN1251($s)
{
  return mb_convert_encoding($s, "windows-1251", "utf-8");
}

function toUTF8($s)
{
  return mb_convert_encoding($s, "utf-8", "windows-1251");
}

function getData($prepareSQL, $params = [], $values = [])
{
  $error = '';
  $result = '';
  $json = [];

  //если передали параметры - заменим их в запросе
  $SQL = str_replace($params, $values, $prepareSQL);
  $string_connect = 'Driver={SQL Server Native Client 10.0};Server=energy5;Database=ipb_cds;';

  $connection = @odbc_connect($string_connect, 'polzovatel', '111');

  $attempts = 0;

  while (odbc_error() and $attempts < 7) {
    // $error = odbc_errormsg();
    // тупая затычка ошибки ODBC
    // пробуем подсоединиться еще раз
    // ставим паузу
    // sleep($attempts);
    sleep(1);
    $connection = @odbc_connect($string_connect, 'polzovatel', '111');
    ++$attempts;
  }

  {
    $result = odbc_exec($connection, $SQL);
    try {
      if ($result) {
        // пропускаем пустые результаты
        while (odbc_num_fields($result) == 0) {
          odbc_next_result($result);
        }

        $id = 0; // искусственно добавим поле с ID строки - для вывода JSON в правильном порядке
        while (odbc_fetch_row($result) ) {
          $row = [];
          $row['id'] = $id++;
          for ($i = 1; $i <= odbc_num_fields($result); $i++) {
            $value = odbc_result($result, odbc_field_name($result, $i));
            $row[odbc_field_name($result, $i)] = gettype($value) == 'string' ? toUTF8($value) : $value;
          }
          $json[] = $row;
        }
      }
      odbc_close($connection);
    } catch (PDOException $e) {
      $error = "Error!: " . $e->getMessage();
    }

    if (count($json) == 0) {
      $error = "Empty result";
    }
  }

  return [$error, json_encode($json)];
}

// Получение данных из тела запроса
function getFormData($method)
{

  // GET или POST: данные возвращаем как есть
  if ($method === 'GET') return $_GET;
  if ($method === 'POST') return $_POST;

  // PUT, PATCH или DELETE
  $data = array();
  $exploded = explode('&', file_get_contents('php://input'));

  foreach ($exploded as $pair) {
    $item = explode('=', $pair);
    if (count($item) == 2) {
      $data[urldecode($item[0])] = urldecode($item[1]);
    }
  }

  return $data;
}


header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Origin: http://*');
header('Access-Control-Allow-Origin: http://10.179.0.26');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, PATCH, DELETE");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Max-Age: 1000");
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header("Content-type:application/json");

// Определяем метод запроса
$method = $_SERVER['REQUEST_METHOD'];

// Получаем данные из тела запроса
$formData = getFormData($method);

// Разбираем url
$url = (isset($_GET['q'])) ? $_GET['q'] : '';
$url = rtrim($url, '/');
$urls = explode('/', $url);

// Определяем роутер и url data
$router = $urls[0];
$urlData = array_slice($urls, 1);

if ($router) {
  // Подключаем файл-роутер и запускаем главную функцию
  include_once 'routers/' . $router . '.php';
  route($method, $urlData, $formData);
} else {
  die('IPB API');
}