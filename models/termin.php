<?php
class Termin {
    public $Termin_ID;
    public $Datum;
    public $Uhrzeit_von;
    public $Uhrzeit_bis;
    public $FK_App_ID;

    function __construct($Termin_ID, $Datum, $Uhrzeit_von, $Uhrzeit_bis, $FK_App_ID) {
        $this->Termin_ID = $Termin_ID;
        $this->Datum = $Datum;
        $this->Uhrzeit_von = $Uhrzeit_von;
        $this->Uhrzeit_bis = $Uhrzeit_bis;
        $this->FK_App_ID = $FK_App_ID;
    }
}
?>