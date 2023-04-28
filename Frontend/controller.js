
//Starting point for JQuery init
$(document).ready(function () {
    console.log("document loaded");
    // call load appointment function when document is ready
    loadAllAppointments();
    // hide the input mask for creating new appointment
    $("#addAppointmentInputFields").hide();
});

//sends selected dates to db
function submitDates(appId) {

    // we select the input fields for the username and the comments
    var username = $('#username'+appId).val();
    var comment = $('#comment'+appId).val();

    // this is an empty array that will hold the IDs of the dates that were checked by the user
    var dates = [];

    // iterate over each checked checkbox in the table
    $('#table'+appId+' input[type=checkbox]:checked').each(function () {
        var row = $(this).closest('tr'); // get the table row containing the checked checkbox
        var rowID = parseInt(row.attr('id'), 10); // parse the ID string into an integer
        console.log(row.attr('id'));
        dates.push(rowID); // add the ID of the selected date to the dates array
    });

    // this object will hold the ID of the selected appointment, the IDs of the selected dates for the appointment, 
    // the name of the user, and the comment created by the user
    var data = {};
    data["appId"] = appId;
    data["dates"] = dates;
    data["username"] = username;
    data["comment"] = comment;
    console.log(data);

    // we send the data to the db via an ajax call
    $.ajax({
        type: "GET",
        url: "../serviceHandler.php",
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

            //-------------------------------------------------------------------------------------
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
            //------------------------------------------------------------------------------------
            // reload all appointments 
            loadAllAppointments();
        },
        error: function(xhr, val, error) {
            console.log("Error: " + error);
        } 
    });
}


//loads and shows available dates of the chosen appointment and the history of the appointment after the "Show Dates" button is clicked
function getDates(appId, appTitel) {

    // search for the show dates button
    var button = $('#button'+appId);
    console.log(button);
   
    // search for the small table of the dates belonging to the appointment 
    var table = $('#table'+appId);
    // search for the column of the large table (appointments) with the small dates table inside it
    var column = $('#column'+appId);
    column.prepend(button);
    
    // search for the history div 
    var history = $('#history');
    // create the username input field 
    var inputUsername = $("<input>").attr({
        "type":"text",
        "id":"username"+appId,
        "placeholder":"Enter username"
    });
    console.log(inputUsername);
    // create the comment input field 
    var inputComment = $("<textarea>").attr({
        "id":"comment"+appId,
        "rows": 4,
        "cols": 40,
        "placeholder":"Enter comment here..."
    });

    // remove existing <br> elements (otherwise the <br> elements get added cumulatively)
    column.find('br').remove();
    inputUsername = $("<br>").add(inputUsername); 
    inputComment = $("<br>").add(inputComment);

    // search for the username and the comment input fields
    var username = $('#username'+appId);
    var comment = $('#comment'+appId);

    // create a submit button for sending the selected dates to the db
    var submit = $("<button>").attr({
        "id":"submit"+appId,
        "onclick":"submitDates("+ appId +")"
    });
    submit = $("<br>").add(submit);
    submit.text("Submit");

    // search for the submit button
    var submitButton = $('#submit'+appId);
     
    //if the dates are visible -> hide and change button name and deleted history
    if (table.is(":visible")) {
        table.toggle();
        username.toggle();
        comment.toggle();
        submitButton.toggle();
        button.text("Show Dates");
        history.empty();
    //if dates are not visible make ajax call and show dates belonging to the appointment
    } else {
        //ajax call to get the dates table
        $.ajax({
            type: "GET",
            url: "../serviceHandler.php",
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
                column.prepend("<br>");
                column.prepend(inputComment);
                column.prepend("<br>");
                column.prepend("<br>");
                column.prepend(inputUsername);
                column.prepend("<br>");
                column.prepend(table);
                button.text("Hide Dates");
                console.log("date list ready"); 
            },
            error: function(xhr, val, error) {
                console.log("Error: " + error);
            } 
        });

        //ajax call to get history (= information which dates user has selected and the user comments)
        $.ajax({
            type: "GET",
            url: "../serviceHandler.php",
            cache: false,
            data: {method: "queryHistory", param: appId},
            dataType: "json",
            success: function (response) {
                //create the history table and fill it with data
                var historyTitle = "<p> History of Appointment " + appTitel + ":</p>";
                var historyTable = "<table id='historyTable"+appId+"'><thead><tr><th>Datum</th><th>Von</th><th>Bis</th><th>Username</th><th>Kommentar</th></tr></thead><tbody>";
                
                $.each(response, function(i, v) {
                    historyTable += "<tr id='"+v.Termin_ID+"'><td>" + v.Datum + "</td><td>" + v.Uhrzeit_von + "</td><td>" + v.Uhrzeit_bis +
                    "</td><td>" + v.Username + "</td><td>" + v.Kommentar + "</td></tr>";
                });

                historyTable += "</tbody></table>";
                //adds the table to the dates column and changes button name
                history.empty();
                history.append(historyTitle);
                history.append(historyTable);
                console.log("date list ready");
            },
            error: function(xhr, val, error) {
                console.log("Error: " + error);
            } 
        });
    }
}

// this is the corresponding onclick function to remove an appointment from the list
function removeAppointment(appId){

    $.ajax({
        type: "GET",
        url: "../serviceHandler.php",
        cache: false,
        data: {method: "removeAppointment", param: appId},
        dataType: "json",
        success: function (response) {
            console.log(response);
            
            //----------------------------------------------------------------
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

            // reload all remaining appointments
            loadAllAppointments();
            //----------------------------------------------------------------
        },
        error: function(xhr, val, error) {
            console.log("Error: " + error);
        } 
    });
}

//gets all appointments from the db and displays them in a table
function loadAllAppointments() {

    // Clear the contents of the appointmentList div
    $('#appointmentList').empty();
    console.log("appointment list empty");

    $.ajax({
        type: "GET",
        url: "../serviceHandler.php",
        cache: false,
        data: {method: "queryAppointments"},
        dataType: "json",
        success: function (response) {
            var table = "<table><thead><th>Titel</th><th>Ort</th><th>Ablaufdatum</th><th></th><th></th></tr></thead><tbody>";
            $.each(response, function(i, v) {
                //buttonID = App_ID which is used for get the Appointment information within the onclick event
                var appointmentId = v.appId;
                var appointmentTitel = v.titel;
                //"date" and "now" used to check if appointment is expired
                const dateString = v.ablaufDatum; // ablaufDatum string in yyyy-mm-dd format
                const dateParts = dateString.split("-"); // split the string into an array of year, month, and day
                const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]); // create a Date object using the array
                const now = new Date(); // create a Date object for the current date and time

                // if ablaufDatum is less than current time, then creates the appointment row without the show dates button, else with the show dates button
                if(date.getTime() < now.getTime()){
                    table += "<tr><td>" + v.titel + "</td><td>" + v.ort + "</td><td>" + v.ablaufDatum + "</td><td id='column"+appointmentId+"'>Expired</td><td><button id='removeButton"+appointmentId+"' class='remove-btn' onclick='removeAppointment(" + appointmentId + ")'>Remove Appointment</button></td></tr>";            
                } else {
                    table += "<tr><td>" + v.titel + "</td><td>" + v.ort + "</td><td>" + v.ablaufDatum + "</td><td id='column"+appointmentId+"'><button id='button"+appointmentId+"' class='choose-btn' onclick='getDates(" + appointmentId +",\""+ appointmentTitel + "\")'>Show Dates</button></td><td><button id='removeButton"+appointmentId+"' class='remove-btn' onclick='removeAppointment(" + appointmentId + ")'>Remove Appointment</button></td></tr>";           
                }
            });
            table += "</tbody></table>";
            $("#appointmentList").html(table);
            console.log("appointment list ready");
        },
        error: function(xhr, val, error) {
            console.log("Error: " + error);
        }   
    });
}


//creates a new appointment in the db and adds the corresponding user input dates, username and comments
function addAppointment() {

    //variables for each date input row
    var newAppointmentTitle =  $("#appointmentTitleInput").val();
    var newAppointmentPlace =  $("#appointmentPlaceInput").val();
    var newAppointmentExpirationDate =  $("#appointmentExpirationDateInput").val();

    //creates newDates array that stores the values of each row (input fields for date)
    var newDates = [];

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
 
    // send the appointment to the db
    $.ajax({
        type: "GET",
        url: "../serviceHandler.php",
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
            
            //---------------------------------------------------------------------
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
            //---------------------------------------------------------------------

            //updates the appointments again to display the newly created appointment
            loadAllAppointments();

            //removes the additional dateRows by deleting the child elements of the additionalRows div
            var additionalRows = document.getElementById("additionalRows");
            additionalRows.innerHTML = "";
            //reset global dateCounter
            dateCounter = 1;
            //reset the values of the initial ("static") input field
            $("#datumInput0").val("");
            $("#uhrzeitVonInput0").val("");
            $("#uhrzeitBisInput0").val("");

            console.log("addAppointment created!");   
        },
        error: function(xhr, val, error) {
            console.log("Error: " + error);
        } 
    });
}

// global variable to count the number of the dates that will be sent to the db
var dateCounter = 1;

//adds additional input fields to the add appointment input box
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










