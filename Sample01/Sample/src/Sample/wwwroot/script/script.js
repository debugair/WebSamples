var baseApiUrl = "/api/";

$(document).ready(function () {
    //hide edit form
    $("#editForm").hide();

    //obsever table for click elements in tbody
    $("#personList").on("click", "table tbody tr", clickPersonRow);

    //bind event handler to add button click
    $("#personAdd").bind("click", clickAddPerson);

    //bind event handler to edit button click
    $("#personEdit").bind("click", clickEditPerson);

    //bind event handler to delete button click
    $("#personDelete").bind("click", clickDeletePerson);

    //bind event handler to cancel button click
    $("#personCancel").bind("click", clickCancelPerson);

    //set focus to input element
    $("#addFamilyname").focus();

    getAllPerson();
});

/********************************************************************
 * EVENTS
 ********************************************************************/
clickAddPerson = function() {
    var person = { "Id": 0, "Familyname": $("#addFamilyname").val(), "Firstname": $("#addFirstname").val() };

    if (person.Familyname !== "" || person.Firstname !== "") {
        addPerson(person);
    }
}

clickEditPerson = function () {
    var person = { "Id": $("#editId").val(), "Familyname": $("#editFamilyname").val(), "Firstname": $("#editFirstname").val() };

    if (person.Id !== "" && person.Familyname !== "" && person.Firstname !== "") {
        putPerson(person);
    }
}

clickDeletePerson = function () {
    var id = $("#editId").val();
    if (id !== "") {
        deletePerson(id);
    }
}

clickCancelPerson = function () {
    cleanUpEditForm();
}

clickPersonRow = function (evt) {
    $("#addForm").hide();
    var clickedRow = $(evt.target).parent();
    $("#editId").val($(clickedRow.children()[0]).html());
    $("#editFamilyname").val($(clickedRow.children()[1]).html());
    $("#editFirstname").val($(clickedRow.children()[2]).html());
    $("#editFamilyname").focus();
    $("#editForm").show();
}

/********************************************************************
 * GET PERSON
 ********************************************************************/
getAllPerson = function() {
    var url = "person";
    var data = {};
    var success = getAllPersonSuccess;
    apiCall(url, data, success, "GET");
}

getAllPersonSuccess = function (response) {
    var container = $("#personList");
    container.empty();

    if (response.length > 0) {
        //build table
        container.append("<table class=\"table table-bordered table-condensed table-striped\"></table>");
        var table = container.children().first();

        //build header
        var header = "<thead><tr>";
        var firstElement = response[0];
        for (var key in firstElement) {
            if (firstElement.hasOwnProperty(key)) {
                header += "<th>" + key + "</th>";
            }
        }
        header += "</tr></thead>";
        table.append(header);

        //build body
        var body = "<tbody>";
        $(response).each(function (pos, item) {
            body += "<tr>";
            for (var value in item) {
                if (item.hasOwnProperty(value)) {
                    body += "<td>" + item[value] + "</td>";
                }
            }
            body += "</tr>";
        });
        body += "</tbody>";
        table.append(body);
    }
}

/********************************************************************
 * ADD PERSON
 ********************************************************************/
addPerson = function(person) {
    var url = "person";
    var data = JSON.stringify(person);
    var success = addPersonSuccess;
    apiCall(url, data, success, "POST");
}

addPersonSuccess = function (response) {
    cleanUpAddForm();
    getAllPerson();
}

/********************************************************************
 * PUT PERSON
 ********************************************************************/
putPerson = function(person) {
    var url = "person";
    var data = JSON.stringify(person);
    var success = putPersonSuccess;
    apiCall(url, data, success, "PUT");
}

putPersonSuccess = function (response) {
    cleanUpEditForm();
    getAllPerson();
}

/********************************************************************
 * DELETE PERSON
 ********************************************************************/
deletePerson = function (id) {
    var url = "person";
    var data = id;
    var success = deletePersonSuccess;
    apiCall(url, data, success, "DELETE");
}

deletePersonSuccess = function (response) {
    cleanUpEditForm();
    getAllPerson();
}

/********************************************************************
 * HELPERS
 ********************************************************************/
apiCall = function (url, data, success, method) {
    var apiUrl = baseApiUrl + url;
    $.ajax({
        dataType: "json",
        url: apiUrl,
        data: data,
        success: success,
        type: method,
        contentType: 'application/json',
        cache: false
    });
}

cleanUpEditForm = function() {
    $("#editForm").hide();
    $("#editId").val("");
    $("#editFamilyname").val("");
    $("#editFirstname").val("");
    $("#addFamilyname").focus();
    $("#addForm").show();
}

cleanUpAddForm = function () {
    $("#addFamilyname").val("");
    $("#addFirstname").val("");
    $("#addFamilyname").focus();
}


