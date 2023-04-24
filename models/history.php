<?php
class History {

    public $Termin_ID;
    public $Datum;
    public $Uhrzeit_von;
    public $Uhrzeit_bis;
    public $FK_App_ID;
    public $Username;
    public $Kommentar;

    function __construct($Termin_ID, $Datum, $Uhrzeit_von, $Uhrzeit_bis, $FK_App_ID, $Username, $Kommentar) {
        $this->Termin_ID = $Termin_ID;
        $this->Datum = $Datum;
        $this->Uhrzeit_von = $Uhrzeit_von;
        $this->Uhrzeit_bis = $Uhrzeit_bis;
        $this->FK_App_ID = $FK_App_ID;
        $this->Username = $Username;
        $this->Kommentar = $Kommentar;
    }
}
?>