<?php
include("./models/appointment.php");

// require access data to DB and build up connection to DB
require_once('./dbaccess.php'); //to retrieve connection details
$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    die("Connection failed. Error in DB connection: ". $conn->connect_errno ." : ". $conn->connect_error); 
    exit();
}


/*
INSERT INTO `appointment` (`Titel`, `Ort`, `Ablaufdatum`) VALUES ('Fussball Training', 'Platz 1', '2023-04-20');
INSERT INTO `appointment` (`Titel`, `Ort`, `Ablaufdatum`) VALUES ('Buchbörse', 'Bibliothek', '2023-04-20');
INSERT INTO `appointment` (`Titel`, `Ort`, `Ablaufdatum`) VALUES ('Film', 'Kino', '2023-04-20');
INSERT INTO `appointment` (`Titel`, `Ort`, `Ablaufdatum`) VALUES ('Konzert', 'Konzerthaus', '2023-04-20');
*/


class DataHandler
{
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    public function queryAppointments()
    {
        /*
        $res =  $this->getDemoData();
        return $res;
        */

        // SELECT from table "appointment" to display all appointments
        $sql = "SELECT * FROM `appointment`";
        $stmt = $this->conn ->prepare($sql);
        $stmt->execute();
        $res = $stmt->get_result();

        $result = array();
        while ($row = $res->fetch_array()) {
            $appointment = new Appointment($row['App_ID'], $row['Titel'], $row['Ort'], $row['Ablaufdatum']);
            array_push($result, $appointment);
        }

        return $result;
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
            new Appointment(1, "Fussball Training", "Platz 1", "20-04-2023"),
            new Appointment(2, "Buchbörse", "Bibliothek", "20-04-2023"),
            new Appointment(3, "Film", "Kino", "20-04-2023"),
            new Appointment(4, "Konzert", "Konzerthaus", "20-04-2023"),
        ];
        return $demodata;
    }
}

?>
