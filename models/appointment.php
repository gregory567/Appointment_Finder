<?php
class Appointment {
    public $id;
    public $titel;
    public $ort;
    public $ablaufDatum;

    function __construct($id, $titel, $ort, $ablaufDatum) {
        $this->id = $id;
        $this->titel = $titel;
        $this->ort = $ort;
        $this->ablaufDatum = $ablaufDatum;
    }
}