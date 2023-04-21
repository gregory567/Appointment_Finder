


//Starting point for JQuery init
$(document).ready(function () {
    console.log("document loaded");
    loadAllAppointments();
});

function showDates(appId) {

    //$('#button.ID').empty();

    var buttonText = $('#button'+appointmentId).text();
    console.log(buttonText);
    
    $('#button'+appointmentId).attr(onclick, function(){
        if (buttonText == "Show Dates") {
            $('#button'+appointmentId).text('Hide');
        } else {
            $('#button'+appointmentId).text('Show Dates');        
        }
        
        
    });


    console.log(appId);
    $.ajax({
        type: "GET",
        url: "./serviceHandler.php",
        cache: false,
        //this.id = App_ID
        data: {method: "queryDates",param: appId},
        dataType: "json",
        success: function (response) {
            var table = "<table><thead><tr><th>Datum</th><th>Von</th><th>Bis</th><th></th></tr></thead><tbody>";
            $.each(response, function(i, v) {
                table += "<tr><td>" + v.Datum + "</td><td>" + v.Uhrzeit_von + "</td><td>" + v.Uhrzeit_bis +
                 "</td><td><input type='checkbox' class='form-check-input'></td></tr>";
            });
            table += "</tbody></table>";
            //geht hier auch append statt html()?
            $("#"+ appId + " td:last").prepend("<div>" + table + "</div>");
            //$("#"+ appId).html(table);

            console.log("appointment list ready");
        }
        
    });

}


function loadAllAppointments() {

    // Clear the contents of the appointmentList div
    $('#appointmentList').empty();
    console.log("appointment list empty");

    $.ajax({
        type: "GET",
        url: "./serviceHandler.php",
        cache: false,
        data: {method: "queryAppointments"},
        dataType: "json",
        success: function (response) {
            var table = "<table><thead><th>Titel</th><th>Ort</th><th>Ablaufdatum</th><th></th></tr></thead><tbody>";
            $.each(response, function(i, v) {
                //buttonID = App_ID which is used for get the Appointment information within the onclick event
                var appointmentId = v.appId;
                console.log(appointmentId);
                console.log(v.appId);
                table += "<tr id="+appointmentId+"><td>" + v.titel + "</td><td>" + v.ort + "</td><td>" + v.ablaufDatum + "</td><td><button class='choose-btn' id='button'"+appointmentId+"'  onclick='showDates(" + appointmentId + ")'>Show Dates</button></td></tr>";            });
                table += "</tbody></table>";
            $("#appointmentList").html(table);

            console.log("appointment list ready");
        }
        
    });
}






