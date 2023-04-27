<?php
include("./models/appointment.php");
include("./models/termin.php");
include("./models/history.php");
require_once("./db/dbaccess.php");

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
    //destructor closes db connection
    public function __destruct() {
        $this->conn->close();
    }



    //inserts the selected user dates for a specific appointment into the db
    public function submitDates($data) {

        // check if username already exists for that appointment (same username can exist in different appointment but must be unique in each appointment)
        $sql = "SELECT * FROM `Termin` 
        JOIN `Gebucht` ON `Termin`.`Termin_ID` = `Gebucht`.`FK_Termin_ID` 
        JOIN `User` ON `Gebucht`.`FK_User_ID` = `User`.`User_ID` 
        WHERE `User`.`Username` = ? AND `Termin`.`FK_App_ID` = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("si", $data['username'], $data['appId']);
        $stmt->execute();
        $res = $stmt->get_result();
        $row = $res->fetch_array();

        //if username has already made their date choices and created a comment for that appointment
        if(!empty($row)){
            return "User already exists.";
        //if user has not yet chosen a date /added a commment -> create new user and add entry in table "Gebucht" for the selected dates and create entry in table "Kommentiert" for the user comment
        } else {

            //create user table via prepared statements
            $sql= "INSERT INTO `User` (`Username`,`FK_App_ID`) VALUES (?,?)";
            $stmt = $this->conn ->prepare($sql);
            $stmt->bind_param("si", $data["username"],$data["appId"]);
            $stmt->execute();

            //get user ID of the just created username by selecting the row with the highest user id
            $sql = "SELECT * FROM `User` WHERE `User`.`Username` = ? AND `User`.`User_ID` = (SELECT MAX(`User_ID`) FROM `User` 
            WHERE `User`.`Username` = ?)";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("ss", $data['username'], $data['username']);
            $stmt->execute();
            $res = $stmt->get_result();
            $row = $res->fetch_array();
            $User_ID = $row["User_ID"];

            //insert into gebucht table via prepared statements
            $sql= "INSERT INTO `Gebucht` (`FK_Termin_ID`,`FK_User_ID`) VALUES(?,?)";
            $stmt = $this->conn ->prepare($sql);

            foreach ($data["dates"] as $value) {
                $stmt->bind_param("ii", $value, $User_ID);
                $stmt->execute();
            }

            //insert into comment table via prepared statements
            $sql= "INSERT INTO `Kommentiert` (`FK_User_ID`,`FK_App_ID`,`Kommentar`) VALUES(?,?,?)";
            $stmt = $this->conn ->prepare($sql);
            $stmt->bind_param("iis", $User_ID, $data["appId"], $data["comment"]);
            $stmt->execute();
            return "Submitted.";
   
        }
        
    }
   
    //selects ALL appointments for overview onload
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

    //queries all dates to a specific appointment id
    public function queryDates($App_ID) {
        $sql = "SELECT * FROM Termin WHERE FK_App_ID = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $App_ID);
        $stmt->execute();
        $res = $stmt->get_result();
        $result = array();
        
        while ($row = $res->fetch_assoc()) {
            $termin = new Termin($row['Termin_ID'], $row['Datum'], $row['Uhrzeit_von'], $row['Uhrzeit_bis'],$row['FK_App_ID']);
            array_push($result, $termin);
        }
        return $result;
    }

    //queries all selected user dates, comments from a specific appointment
    public function queryHistory($App_ID) {
        //selects all data 
        $sql = "SELECT Termin.*, User.Username, Kommentiert.Kommentar
        FROM `Termin`
        JOIN `Gebucht` ON `Termin`.`Termin_ID` = `Gebucht`.`FK_Termin_ID`
        JOIN `User` ON `Gebucht`.`FK_User_ID` = `User`.`User_ID`
        JOIN `Kommentiert` ON `Termin`.`FK_App_ID` = `Kommentiert`.`FK_App_ID` AND `User`.`User_ID` = `Kommentiert`.`FK_User_ID`
        WHERE `Termin`.`FK_App_ID` = $App_ID;";

        $stmt = $this->conn ->prepare($sql);
        $stmt->execute();
        $res = $stmt->get_result();

        $result = array();
        while ($row = $res->fetch_assoc()) {
            $history = new History($row['Termin_ID'], $row['Datum'], $row['Uhrzeit_von'], $row['Uhrzeit_bis'],$row['FK_App_ID'], $row['Username'],$row['Kommentar']);
            array_push($result, $history);
        }
        return $result;
    }
    
    //removes the appointment by first deleted the date references and then the appointment
    public function removeAppointment($App_ID){

        $sql = "DELETE FROM `Appointment` WHERE `App_ID` = $App_ID";
        $stmt = $this->conn ->prepare($sql);
        $stmt->execute();
        $successMessage = "Appointment deleted successfully.";
        
        return $successMessage;
    }

    //creates new Appointment
    public function addAppointment($data) {

        //creates the new appointment
        $sql= "INSERT INTO `Appointment` (`Titel`,`Ort`,`Ablaufdatum`) VALUES(?,?,?)";
        $stmt = $this->conn ->prepare($sql);
        $stmt->bind_param("sss", $data["newAppointmentTitle"], $data["newAppointmentPlace"],$data["newAppointmentExpirationDate"]);
        $stmt->execute();

        //selects the just created appointment by selecting the highest appointment ID
        $sql = "SELECT * FROM `Appointment` WHERE `Appointment`.`App_ID` = (SELECT MAX(`App_ID`) FROM `Appointment`)";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $res = $stmt->get_result();
        $row = $res->fetch_array();
        $App_ID = $row["App_ID"];

        //prepares for inserting dates into db
        $sql= "INSERT INTO `Termin` (`Datum`,`Uhrzeit_von`,`Uhrzeit_bis`,`FK_App_ID`) VALUES(?,?,?,?)";
        $stmt = $this->conn ->prepare($sql);
        //iterates through data and gets each date and insterts it into the "Termin" table (for loop does no work here because phparrayindexes are different somehow)
        
        //adds each date into the "Termin" table with the newly created appointment ID
        foreach ($data["newDates"] as $newDate) {
            $dateInput = $newDate[0];
            $fromInput = $newDate[1];
            $untilInput = $newDate[2];
        
            $stmt->bind_param("sssi", $dateInput, $fromInput, $untilInput, $App_ID);
            $stmt->execute();
        }
        

        $successMessage = "Appointment created successfully!";
        return $successMessage;
    }
}
?>
