<?php
include("./models/appointment.php");
include("./models/termin.php");
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

    public function submitDates($data) {
        //insert into user table via prepared statements
        $sql= "INSERT INTO `User` (`Username`) VALUES(?)";
        $stmt = $this->conn ->prepare($sql);
        $stmt->bind_param("s", $data["username"]);
        $stmt->execute();

        //get User ID to just created Username
        //TO DO: can cause problems because there can be multiple users with the same name 
        $sql = "SELECT `User_ID` FROM `User` WHERE `Username` = '" . $data['username'] . "'";
        $stmt = $this->conn ->prepare($sql);
        $stmt->execute();
        $res = $stmt->get_result();
        $row = $res->fetch_array();
        $User_ID = $row["User_ID"];

        //insert into gebucht table via prepared statements
        $sql= "INSERT INTO `Gebucht` (`FK_Termin_ID`,`FK_User_ID`) VALUES(?,?)";
        $stmt = $this->conn ->prepare($sql);

        foreach ($data["dates"] as $value) {
            //$key . " = " . $value . "<br>";
            $stmt->bind_param("ii", $value, $User_ID);
            $stmt->execute();
        }

        //insert into comment table via prepared statements
        $sql= "INSERT INTO `Kommentiert` (`FK_User_ID`,`FK_App_ID`,`Kommentar`) VALUES(?,?,?)";
        $stmt = $this->conn ->prepare($sql);
        $stmt->bind_param("iis", $User_ID, $data["appId"], $data["comment"]);
        $stmt->execute();

        return "Submit worked";
    }
   

    public function queryAppointments() {        
        
        // SELECT from table "appointment" to display all appointments
        $sql = "SELECT * FROM `Appointment`";
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


    public function queryDates($App_ID) {
        $sql = "SELECT *  FROM `Termin` WHERE `FK_App_ID` = $App_ID";
        $stmt = $this->conn ->prepare($sql);
        $stmt->execute();
        $res = $stmt->get_result();

        $result = array();
        while ($row = $res->fetch_assoc()) {
            $termin = new Termin($row['Termin_ID'], $row['Datum'], $row['Uhrzeit_von'], $row['Uhrzeit_bis'],$row['FK_App_ID']);
            array_push($result, $termin);
        }

        return $result;
    }


}
?>
