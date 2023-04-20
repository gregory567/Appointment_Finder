


//Starting point for JQuery init
$(document).ready(function () {
    console.log("document loaded");
    loadAllAppointments();
});


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
            var table = "<table><thead><tr><th>App_ID</th><th>Titel</th><th>Ort</th><th>Ablaufdatum</th><th></th></tr></thead><tbody>";
            $.each(response, function(i, v) {
                table += "<tr><td>" + v.appId + "</td><td>" + v.titel + "</td><td>" + v.ort + "</td><td>" + v.ablaufDatum + "</td><td><button class='choose-btn'>Choose</button></td></tr>";
            });
            table += "</tbody></table>";
            $("#appointmentList").html(table);

            console.log("appointment list ready");
        }
        
    });
}






