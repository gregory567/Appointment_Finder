<?php
include("./models/appointment.php");
require_once("./dbaccess.php"); //to retrieve connection details


/*
INSERT INTO `appointment` (`Titel`, `Ort`, `Ablaufdatum`) VALUES ('Fussball Training', 'Platz 1', '2023-04-20');
INSERT INTO `appointment` (`Titel`, `Ort`, `Ablaufdatum`) VALUES ('Buchbörse', 'Bibliothek', '2023-04-20');
INSERT INTO `appointment` (`Titel`, `Ort`, `Ablaufdatum`) VALUES ('Film', 'Kino', '2023-04-20');
INSERT INTO `appointment` (`Titel`, `Ort`, `Ablaufdatum`) VALUES ('Konzert', 'Konzerthaus', '2023-04-20');
*/


class DataHandler
{
    private $conn;
    private $host;
    private $user;
    private $password;
    private $database;

    public function __construct($host, $user, $password, $database)
    {
        $this->host = $host;
        $this->user = $user;
        $this->password = $password;
        $this->database = $database;

        $this->conn = new mysqli($this->host, $this->user, $this->password, $this->database);
        if ($this->conn->connect_error) {
            die("Connection failed. Error in DB connection: ". $this->conn->connect_errno ." : ". $this->conn->connect_error); 
            exit();
        }
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
        while ($row = $res->fetch_assoc()) {
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
