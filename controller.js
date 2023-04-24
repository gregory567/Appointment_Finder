//Starting point for JQuery init
$(document).ready(function () {
    console.log("document loaded");
    loadAllAppointments();
    $("#addAppointmentInputFields").hide();
});


function submitDates(appId) {

    var username = $('#username'+appId).val();
    var comment = $('#comment'+appId).val();

    // this is an empty array that will hold the IDs of the dates that were checked by the user
    var dates = [];

    // iterate over each checked checkbox in the table
    $('#table'+appId+' input[type=checkbox]:checked').each(function () {
        var row = $(this).closest('tr'); // get the table row containing the checked checkbox
        var rowID = parseInt(row.attr('id'), 10); // parse the ID string into an integer
        console.log(row.attr('id'));
        dates.push(rowID); // add the selected date to the array
    });

    // this object will hold the ID of the selected appointment, the selected dates for the appointment, 
    // the name of the user, and the comment created by the user
    var data = {};
    data["appId"] = appId;
    data["dates"] = dates;
    data["username"] = username;
    data["comment"] = comment;
    console.log(data);


    $.ajax({
        type: "GET",
        url: "./serviceHandler.php",
        cache: false,
        data: {method: "submitDates", param: data},
        dataType: "json",
        success: function (response) {
            console.log(response);

            // clear the content of the input fields
            $('#username'+appId).val('');
            $('#comment'+appId).val('');
            // uncheck all checkboxes
            $('#table'+appId+' input[type=checkbox]:checked').prop('checked', false);

            // create the modal content with the response
            var modalContent = $('<div>').addClass('modal-content')
            .append($('<div>').addClass('modal-header')
            .append($('<button>').addClass('close').attr('data-dismiss', 'modal').html('&times;')))
            .append($('<div>').addClass('modal-body').html(response))
            .append($('<div>').addClass('modal-footer'));

            // create the modal and append the content
            var modal = $('<div>').addClass('modal').attr('id', 'myModal')
            .append($('<div>').addClass('modal-dialog')
            .append(modalContent));

            // append the modal to the page
            $('body').append(modal);

            // show the modal
            $('#myModal').modal('show');

            // add a delegated event listener for the close button
            $('body').on('click', '.modal .close', function() {
                $(this).closest('.modal').modal('hide'); // hide the modal
                $(this).closest('.modal').remove(); // remove the modal from the DOM
            });
        },
        error: function(error) {
            console.log("Error: " + error);
        } 
    });
}


//loads and shows dates of the chosen appointment after the show dates button is clicked
function getDates(appId) {

    var button = $('#button'+appId);
    console.log(button);
    
    var table = $('#table'+appId);
    var column = $('#column'+appId);
    var inputUsername = $("<input>").attr({
        "type":"text",
        "id":"username"+appId
    });
    var inputComment = $("<textarea>").attr({
        "id":"comment"+appId,
        "rows": 4,
        "cols": 40

    });
    var username = $('#username'+appId);
    var comment = $('#comment'+appId);

    var submit = $("<button>").attr({
        "id":"submit"+appId,
        "onclick":"submitDates("+ appId +")"
    });
    submit.text("Submit");

    var submitButton =$('#submit'+appId);


    //if the dates are visible ->hide and change button name
    if (table.is(":visible")) {
        table.toggle();
        username.toggle();
        comment.toggle();
        submitButton.toggle();
        button.text("Show Dates");
    //if dates are not visible make ajax call and show dates
    } else {
        $.ajax({
            type: "GET",
            url: "./serviceHandler.php",
            cache: false,
            data: {method: "queryDates", param: appId},
            dataType: "json",
            success: function (response) {
                //create the date table and fill them with date information and add checkbox
                var table = "<table id='table"+appId+"'><thead><tr><th>Datum</th><th>Von</th><th>Bis</th><th></th></tr></thead><tbody>";
                $.each(response, function(i, v) {
                    table += "<tr id='"+v.Termin_ID+"'><td>" + v.Datum + "</td><td>" + v.Uhrzeit_von + "</td><td>" + v.Uhrzeit_bis +
                    "</td><td><input type='checkbox' class='form-check-input'></td></tr>";

                });
                table += "</tbody></table>";
                //adds the table to the dates column and changes button name
                column.prepend(submit);
                column.prepend(inputComment);
                column.prepend(inputUsername);
                column.prepend("<div>" + table + "</div>");
                button.text("Hide Dates");
       
                // append input element to div
                console.log(button);
                console.log(inputUsername);
                console.log("date list ready");
             
            },
            error: function(error) {
                console.log("Error: " + error);
            } 
        });

 
    }
}


function removeAppointment(appId){

    $.ajax({
        type: "GET",
        url: "./serviceHandler.php",
        cache: false,
        data: {method: "removeAppointment", param: appId},
        dataType: "json",
        success: function (response) {
            console.log(response);

            // create the modal content with the response
            var modalContent = $('<div>').addClass('modal-content')
            .append($('<div>').addClass('modal-header')
            .append($('<button>').addClass('close').attr('data-dismiss', 'modal').html('&times;')))
            .append($('<div>').addClass('modal-body').html(response))
            .append($('<div>').addClass('modal-footer'));

            // create the modal and append the content
            var modal = $('<div>').addClass('modal').attr('id', 'myModal')
            .append($('<div>').addClass('modal-dialog')
            .append(modalContent));

            // append the modal to the page
            $('body').append(modal);

            // show the modal
            $('#myModal').modal('show');

            // add a delegated event listener for the close button
            $('body').on('click', '.modal .close', function() {
                $(this).closest('.modal').modal('hide'); // hide the modal
                $(this).closest('.modal').remove(); // remove the modal from the DOM
            });

            loadAllAppointments();
        },
        error: function(error) {
            console.log("Error: " + error);
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
            var table = "<table><thead><th>Titel</th><th>Ort</th><th>Ablaufdatum</th><th></th><th></th></tr></thead><tbody>";
            $.each(response, function(i, v) {
                //buttonID = App_ID which is used for get the Appointment information within the onclick event
                var appointmentId = v.appId;

                const dateString = v.ablaufDatum; // ablaufDatum string in yyyy-mm-dd format
                const dateParts = dateString.split("-"); // split the string into an array of year, month, and day
                const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]); // create a Date object using the array
                const now = new Date(); // create a Date object for the current date and time

                // if ablaufDatum is less than current time, then creates the appointment row without the show dates button, else with the show dates button
                if(date.getTime() < now.getTime()){
                    table += "<tr><td>" + v.titel + "</td><td>" + v.ort + "</td><td>" + v.ablaufDatum + "</td><td id='column"+appointmentId+"'>Expired</td><td><button id='removeButton"+appointmentId+"' class='remove-btn' onclick='removeAppointment(" + appointmentId + ")'>Remove Appointment</button></td></tr>";            
                } else {
                    table += "<tr><td>" + v.titel + "</td><td>" + v.ort + "</td><td>" + v.ablaufDatum + "</td><td id='column"+appointmentId+"'><button id='button"+appointmentId+"' class='choose-btn' onclick='getDates(" + appointmentId + ")'>Show Dates</button></td><td><button id='removeButton"+appointmentId+"' class='remove-btn' onclick='removeAppointment(" + appointmentId + ")'>Remove Appointment</button></td></tr>";            
                }
            });
            table += "</tbody></table>";
            $("#appointmentList").html(table);
            console.log("appointment list ready");
        },
        error: function(error) {
            console.log("Error: " + error);
        }   
    });
}


function addAppointment() {

    //variables for each date input row
    var newAppointmentTitle =  $("#appointmentPlaceInput").val();
    var newAppointmentPlace =  $("#appointmentTitleInput").val();
    var newAppointmentExpirationDate =  $("#appointmentExpirationDateInput").val();

    //creates newDates array that stores the values of each row (inputfields for date)
    var newDates = [];
    //console.log(dateCounter);

    //adds the dates data as an array to the newDates array

    for (let i = 0; i < dateCounter; i++) {
        let dates = [];
        dates.push($('#datumInput'+i).val());
        dates.push($('#uhrzeitVonInput'+i).val());
        dates.push($('#uhrzeitBisInput'+i).val());
        console.log(i);
        newDates.push(dates);
    }

    var data = {};
    data["newAppointmentTitle"] = newAppointmentTitle;
    data["newAppointmentPlace"] = newAppointmentPlace;
    data["newAppointmentExpirationDate"] = newAppointmentExpirationDate;
    data["newDates"] = newDates;

    console.log(data);
 

    $.ajax({
        type: "GET",
        url: "./serviceHandler.php",
        cache: false,
        data: {method: "addAppointment", param: data},
        dataType: "json",
        success: function (response) {
            console.log(response);

            // clear the content of the input fields
            $("#appointmentTitleInput").val('');
            $("#appointmentPlaceInput").val('');
            $("#appointmentExpirationDateInput").val('');

            toggleAddAppointmentFields();
   

            // create the modal content with the response
            var modalContent = $('<div>').addClass('modal-content')
            .append($('<div>').addClass('modal-header')
            .append($('<button>').addClass('close').attr('data-dismiss', 'modal').html('&times;')))
            .append($('<div>').addClass('modal-body').html(response))
            .append($('<div>').addClass('modal-footer'));

            // create the modal and append the content
            var modal = $('<div>').addClass('modal').attr('id', 'myModal')
                .append($('<div>').addClass('modal-dialog')
                    .append(modalContent));

            // append the modal to the page
            $('body').append(modal);

            // show the modal
            $('#myModal').modal('show');

            // add a delegated event listener for the close button
            $('body').on('click', '.modal .close', function() {
                $(this).closest('.modal').modal('hide'); // hide the modal
                $(this).closest('.modal').remove(); // remove the modal from the DOM
            });

            //updates the appointments
            loadAllAppointments();
            rowcounter = 0;

            console.log("addAppointment created!");
            
        },
        error: function(error) {
            console.log("Error: " + error);
            
        } 
    });
}

var dateCounter = 1;

function addDate() {
    var newRow = $("<div>").addClass("mb-3");
    console.log(dateCounter);
    newRow.html(
        '<div class="row">' +
        '<div class="col-md-4">' +
        '<label for="datumInput' + dateCounter + '" class="form-label">Datum:</label>' +
        '<input type="date" class="form-control" id="datumInput' + dateCounter + '" required>' +
        '</div>' +
        '<div class="col-md-4">' +
        '<label for="uhrzeitVonInput' + dateCounter + '" class="form-label">Uhrzeit von:</label>' +
        '<input type="time" class="form-control" id="uhrzeitVonInput' + dateCounter + '" required>' +
        '</div>' +
        '<div class="col-md-4">' +
        '<label for="uhrzeitBisInput' + dateCounter + '" class="form-label">Uhrzeit bis:</label>' +
        '<input type="time" class="form-control" id="uhrzeitBisInput' + dateCounter + '" required>' +
        '</div>' +
        '</div>'
    );
    $("#additionalRows").append(newRow);
    dateCounter++;
}




function toggleAddAppointmentFields() {
    $("#addAppointmentInputFields").fadeToggle();
  }







