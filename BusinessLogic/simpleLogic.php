<?php
include("./db/dataHandler.php");

class SimpleLogic
{
    private $dh;
    function __construct()
    {
        $this->dh = new DataHandler($host, $user, $password, $database);
    }

    function handleRequest($method, $param)
    {
        switch ($method) {
            case "queryAppointments":
                $res = $this->dh->queryAppointments();
                break;
            case "queryAppointmentById":
                $res = $this->dh->queryAppointmentById($param);
                break;
            case "queryAppointmentByTitel":
                $res = $this->dh->queryAppointmentByTitel($param);
                break;
            case "querySuggestion":
                $res = $this->dh->querySuggestion($param);
                break;
            default:
                $res = "test";
                break;
        }
        return $res;
    }
}


?>
