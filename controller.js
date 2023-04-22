//Starting point for JQuery init
$(document).ready(function () {
    console.log("document loaded");
    loadAllAppointments();
});


//loads and shows dates of the chosen appointment after the show button is clicked
function showDates(appId) {

    console.log(appId);
    var button = $('#button'+appId);
    console.log(button);
    
    var table = $('#table'+appId);
    var column = $('#column'+appId);

    //if the dates are visible ->hide and change button name
    if (table.is(":visible")) {  
        table.toggle();
        button.text("Show Dates");
    //if dates are not visible make ajax call and show dates
    } else {
        $.ajax({
            type: "GET",
            url: "./serviceHandler.php",
            cache: false,
            data: {method: "queryDates",param: appId},
            dataType: "json",
            success: function (response) {
                //create the date table and fill them with date information and add checkbox
                var table = "<table id='table"+appId+"'><thead><tr><th>Datum</th><th>Von</th><th>Bis</th><th></th></tr></thead><tbody>";
                $.each(response, function(i, v) {
                    table += "<tr><td>" + v.Datum + "</td><td>" + v.Uhrzeit_von + "</td><td>" + v.Uhrzeit_bis +
                    "</td><td><input type='checkbox' class='form-check-input'></td></tr>";
                });
                table += "</tbody></table>";
                //adds the table to the dates column and changes button name
                column.prepend("<div>" + table + "</div>");
                console.log("date list ready");
                button.text("Hide Dates");
            } 
        });  
    }
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
                table += "<tr ><td>" + v.titel + "</td><td>" + v.ort + "</td><td>" + v.ablaufDatum + "</td><td id='column"+appointmentId+"'><button id='button"+appointmentId+"' class='choose-btn' onclick='showDates(" + appointmentId + ")'>Show Dates</button></td></tr>";            });
                table += "</tbody></table>";
                $("#appointmentList").html(table);

            console.log("appointment list ready");
        }
        
    });
}






