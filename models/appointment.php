<?php
class Appointment {
    public $appId;
    public $titel;
    public $ort;
    public $ablaufDatum;

    function __construct($appId, $titel, $ort, $ablaufDatum) {
        $this->appId = $appId;
        $this->titel = $titel;
        $this->ort = $ort;
        $this->ablaufDatum = $ablaufDatum;
    }
}
?>