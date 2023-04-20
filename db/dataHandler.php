<?php
include("./models/appointment.php");

// require access data to DB and build up connection to DB
require_once('./dbaccess.php'); //to retrieve connection details
$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    die("Connection failed. Error in DB connection: ". $conn->connect_errno ." : ". $conn->connect_error); 
}


class DataHandler
{
    public function queryAppointments()
    {
        $res =  $this->getDemoData();
        return $res;
    }

    public function queryAppointmentById($id)
    {
        $result = array();
        foreach ($this->queryAppointments() as $val) {
            if ($val->id == $id) {
                array_push($result, $val);
            }
        }
        return $result;
    }

    public function queryAppointmentByTitel($titel)
    {
        $result = array();
        foreach ($this->queryAppointments() as $val) {
            if ($val->titel == $titel) {
                array_push($result, $val);
            }
        }
        return $result;
    }

    public function querySuggestion($titel) {
        $result = array();
        foreach($this->queryAppointments() as $val) {
            if (str_contains($val->titel, $titel)) {
                array_push($result, $val);
            }
        }
        return $result;
    }

    private static function getDemoData()
    {
        $demodata = [
            new Appointment(1, "Fussball Training", "Platz 1", "04-20-2023"),
            new Appointment(2, "Buchbörse", "Bibliothek", "04-20-2023"),
            new Appointment(3, "Film", "Kino", "04-20-2023"),
            new Appointment(4, "Konzert", "Konzerthaus", "04-20-2023"),
        ];
        return $demodata;
    }
}

?>
