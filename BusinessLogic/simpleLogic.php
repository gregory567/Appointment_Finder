<?php
include("./db/dataHandler.php");

class SimpleLogic
{
    private $dh;
    private $host;
    private $user;
    private $password;
    private $database;

    function __construct($host, $user, $password, $database)
    {
        $this->host = $host;
        $this->user = $user;
        $this->password = $password;
        $this->database = $database;

        $this->dh = new DataHandler($this->host, $this->user, $this->password, $this->database);
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
