<?php
include("./models/appointment.php");
include("./dbaccess.php"); //to retrieve connection details


/*
// require access data to DB and build up connection to DB
require_once('./dbaccess.php'); //to retrieve connection details
$dbconn = new mysqli($host, $user, $password, $database);
if ($dbconn->connect_error) {
    die("Connection failed. Error in DB connection: ". $dbconn->connect_errno ." : ". $dbconn->connect_error); 
    exit();
} else {
    echo "Connected successfully";
}


if (isset($host)) {
echo "Host is set to: " . $host . "<br>";
} else {
echo "Host is not set.<br>";
}

if (isset($user)) {
echo "User is set to: " . $user . "<br>";
} else {
echo "User is not set.<br>";
}

if (isset($password)) {
echo "Password is set to: " . $password . "<br>";
} else {
echo "Password is not set.<br>";
}

if (isset($database)) {
echo "Database is set to: " . $database . "<br>";
} else {
echo "Database is not set.<br>";
}
*/


/*
INSERT INTO `appointment` (`Titel`, `Ort`, `Ablaufdatum`) VALUES ('Fussball Training', 'Platz 1', '2023-04-20');
INSERT INTO `appointment` (`Titel`, `Ort`, `Ablaufdatum`) VALUES ('Buchbörse', 'Bibliothek', '2023-04-20');
INSERT INTO `appointment` (`Titel`, `Ort`, `Ablaufdatum`) VALUES ('Film', 'Kino', '2023-04-20');
INSERT INTO `appointment` (`Titel`, `Ort`, `Ablaufdatum`) VALUES ('Konzert', 'Konzerthaus', '2023-04-20');
*/


class DataHandler
{
    /*
    private $conn;

    public function __construct()
    {
        $this->conn = $dbconn;
    }
    */
    

    public function queryAppointments()
    {
    
        $res =  $this->getDemoData();
        return $res;
        
        /*
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
        */
        
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
