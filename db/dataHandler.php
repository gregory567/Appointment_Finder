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

        // check if username already exists in that appointment 
        $sql = "SELECT * FROM `Termin` JOIN `Gebucht` ON `Termin`.`Termin_ID` = `Gebucht`.`FK_Termin_ID` JOIN `User` ON `Gebucht`.`FK_User_ID` = `User`.`User_ID` WHERE `User`.`Username` = '" . $data['username'] . "' AND `Termin`.`FK_App_ID` = '" . $data['appId'] . "'";
        $stmt = $this->conn ->prepare($sql);
        $stmt->execute();
        $res = $stmt->get_result();
        $row = $res->fetch_array();


        if(!empty($row)){
            return "User already exists.";
        } else {

            //insert into user table via prepared statements
            $sql= "INSERT INTO `User` (`Username`) VALUES(?)";
            $stmt = $this->conn ->prepare($sql);
            $stmt->bind_param("s", $data["username"]);
            $stmt->execute();

            //get user ID of the just created username by selecting the row with the highest user id
            //TO DO: there can be multiple users with the same name 
            $sql = "SELECT * FROM `User` WHERE `User`.`Username` = ? AND `User`.`User_ID` = (SELECT MAX(`User_ID`) FROM `User` WHERE `User`.`Username` = ?)";
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

    public function removeAppointment($App_ID){

        // TO DO: "on delete cascade" einstellen bei der Tabelle Appointment
        $sql = "DELETE FROM `Appointment` WHERE `App_ID` = $App_ID";
        $stmt = $this->conn ->prepare($sql);
        $stmt->execute();
        $successMessage = "Appointment deleted successfully.";
        
        return $successMessage;
    }

    //creates new Appointment
    public function addAppointment($data) {
        $sql= "INSERT INTO `Appointment` (`Titel`,`Ort`,`Ablaufdatum`) VALUES(?,?,?)";
        $stmt = $this->conn ->prepare($sql);
        $stmt->bind_param("sss", $data["newAppointmentTitle"], $data["newAppointmentPlace"],$data["newAppointmentExpirationDate"]);
        $stmt->execute();



        $sql = "SELECT * FROM `Appointment` WHERE `Appointment`.`App_ID` = (SELECT MAX(`App_ID`) FROM `Appointment`)";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $res = $stmt->get_result();
        $row = $res->fetch_array();
        $App_ID = $row["App_ID"];

        $length = count($data);
        error_log($length);
        //prepares for inserting dates into db
        $sql= "INSERT INTO `Termin` (`Datum`,`Uhrzeit_von`,`Uhrzeit_bis`,`FK_App_ID`) VALUES(?,?,?,?)";
        $stmt = $this->conn ->prepare($sql);
        //iterates through data and gets each date and insterts it into the "Termin" table (for loop does no work here because phparrayindexes are different somehow)

        foreach ($data["newDates"] as $newDate) {
            $dateInput = $newDate[0];
            $fromInput = $newDate[1];
            $untilInput = $newDate[2];
        
            $stmt->bind_param("sssi", $dateInput, $fromInput, $untilInput, $App_ID);
            $stmt->execute();
        }
        
/*      FOR LOOP DOES NOT WORK
        for ($i = 0; $i < $length-1; $i++ ) {
        
           // error_log(($data["newDates"][$i][0]));
           // error_log(($data["newDates"][$i][1]));
           // error_log(($data["newDates"][$i][2]));

            $dateInput= $data["newDates"][$i][2];
            $fromInput= $data["newDates"][$i][3];
            $untilInput= $data["newDates"][$i][4];

            $stmt->bind_param("sssi", $dateInput,$fromInput,$untilInput,$App_ID);
            $stmt->execute();
        }
*/ 

        $successMessage = "Appointment created successfully!";
        return $successMessage;
    }
}
?>
