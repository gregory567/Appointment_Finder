


//Starting point for JQuery init
$(document).ready(function () {
    loadAllAppointments();
});

/*
function loaddata_ByName(searchterm) {

    $.ajax({
        type: "GET",
        url: "./serviceHandler.php",
        cache: false,
        data: {method: "queryPersonByName", param: searchterm},
        dataType: "json",
        success: function (response) {            
            $("#noOfentries").val(response.length);

            let table = $("<table>"); // create the table element
            let head = $("<thead>");
            let body = $("<tbody>");

            // create the table header
            head.append($("<tr>"));
            head.append($("<th>").text("First Name"));
            head.append($("<th>").text("Last Name"));
            head.append($("<th>").text("ID"));

            // create the table rows
            $.each(response, function(i, v) {
                let row = body.append($("<tr>"));
                $("<td>").text(v.firstname).appendTo(row);
                $("<td>").text(v.lastname).appendTo(row);
                $("<td>").text(v.id).appendTo(row);
            });

            // assemble the table and add it to the DOM
            table.append(head).append(body);
            $("#entries_byName").empty().append(table);
            $("#searchResult").show(1000).delay(3000).hide(1000);

            $.each(response, function(i, v) {
                console.log(v.firstname + " " + v.lastname + " (id=" + v.id + ")");
            });
        }
        
    });
}
*/


function loadAllAppointments() {

    // Clear the contents of the appointmentList div
    $('#appointmentList').empty();

    $.ajax({
        type: "GET",
        url: "./serviceHandler.php",
        cache: false,
        data: {method: "queryAppointments"},
        dataType: "json",
        success: function (response) {
            var table = "<table><thead><tr><th>App_ID</th><th>Titel</th><th>Ort</th><th>Ablaufdatum</th></tr></thead><tbody>";
            $.each(response, function(i, v) {
                table += "<tr><td>" + v.appId + "</td><td>" + v.titel + "</td><td>" + v.ort + "</td><td>" + v.ablaufDatum + "</td></tr>";
            });
            table += "</tbody></table>";
            $("#appointmentList").html(table);
        }
        
    });
}





