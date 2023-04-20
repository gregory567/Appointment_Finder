<?php
include("./models/appointment.php");
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
            new Appointment(1, "Fussball Training", "Platz 1", 04-20-2023),
            new Appointment(2, "Buchbörse", "Bibliothek", 04-20-2023),
            new Appointment(3, "Film", "Kino", 04-20-2023),
            new Appointment(4, "Konzert", "Konzerthaus", 04-20-2023),
        ];
        return $demodata;
    }
}
