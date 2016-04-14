var baseApiUrl = "/api/";
var entityName = "person";
var baseEntity = { "Id": 0, "Familyname": "", "Firstname": "", "Middlename": "" };
var keyProperty = "Id";
var containerName = "container";
var addFormName = "addForm";
var editFormName = "editForm";
var container = "#" + containerName;
var addForm = "#" + addFormName;
var editForm = "#" + editFormName;
var entityListName = "entityList";
var entityList = "#" + entityListName;


$(document).ready(function () {
    //add empty containers
    $(container).append("<div class=\"row\" id=\"" + addFormName + "\"></div>");
    $(container).append("<div class=\"row\" id=\"" + editFormName + "\"></div>");
    $(container).append("<div class=\"row\" id=\"" + entityListName + "\"></div>");

    //obsever add button for click
    $(addForm).on("click", "#entityAdd", clickAddEntity);
    //observer edit button for click
    $(editForm).on("click", "#entityEdit", clickEditEntity);
    //observer delete button for click
    $(editForm).on("click", "#entityDelete", clickDeleteEntity);
    //observer cancel button for click
    $(editForm).on("click", "#entityCancel", clickCancelEntity);
    //obsever table for click elements in tbody
    $(entityList).on("click", "table tbody tr", clickEntityRow);

    //build forms
    buildAddForm();
    buildEditForm();

    //get all entities
    getAllEntities();
});


/********************************************************************
 * EVENTS
 ********************************************************************/
clickAddEntity = function () {
    var entity = $.extend(true, {}, baseEntity);
    for (var key in entity) {
        if (entity.hasOwnProperty(key)) {
            entity[key] = $("#add" + key).val();
        }
    }
    addEntity(entity);
}

clickEditEntity = function () {
    var entity = $.extend(true, {}, baseEntity);
    for (var key in entity) {
        if (entity.hasOwnProperty(key)) {
            entity[key] = $("#edit" + key).val();
        }
    }
    putEntity(entity);
}

clickDeleteEntity = function () {
    var id = $("#edit" + keyProperty).val();
    if (id !== "") {
        deleteEntity(id);
    }
}

clickCancelEntity = function () {
    emptyEditForm();
    $(editForm).hide();
    $(addForm).show();
}

clickEntityRow = function (evt) {
    $(addForm).hide();
    var clickedRow = $(evt.target).parent();
    $(clickedRow.children()).each(function (pos, item) {
        var prop = getEntityPropertyName(pos);
        $("#edit" + prop).val($(item).html());
    });
    $(editForm).show();
}


/********************************************************************
 * GET ENTITY
 ********************************************************************/
getAllEntities = function () {
    var url = entityName;
    var data = {};
    var success = getAllEntitiesSuccess;
    apiCall(url, data, success, "GET");
}

getAllEntitiesSuccess = function (response) {
    var container = $(entityList);
    container.empty();

    //build table
    container.append("<table class=\"table table-bordered table-condensed table-striped\"></table>");
    var table = container.children().first();

    //build header
    var header = "<thead><tr>";
    var firstElement = baseEntity;
    for (var key in firstElement) {
        if (firstElement.hasOwnProperty(key)) {
            header += "<th>" + key + "</th>";
        }
    }
    header += "</tr></thead>";
    table.append(header);

    if (response.length > 0) {
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
 * ADD ENTITY
 ********************************************************************/
addEntity = function (entity) {
    var url = entityName;
    var data = JSON.stringify(entity);
    var success = addEntitySuccess;
    apiCall(url, data, success, "POST");
}

addEntitySuccess = function (response) {
    emptyAddForm();
    getAllEntities();
}


/********************************************************************
 * PUT ENTITY
 ********************************************************************/
putEntity = function (entity) {
    var url = entityName;
    var data = JSON.stringify(entity);
    var success = putEntitySuccess;
    apiCall(url, data, success, "PUT");
}

putEntitySuccess = function (response) {
    emptyEditForm();
    $(editForm).hide();
    $(addForm).show();
    getAllEntities();
}


/********************************************************************
 * DELETE ENTITY
 ********************************************************************/
deleteEntity = function (id) {
    var url = entityName;
    var data = id;
    var success = deleteEntitySuccess;
    apiCall(url, data, success, "DELETE");
}

deleteEntitySuccess = function (response) {
    emptyEditForm();
    $(editForm).hide();
    $(addForm).show();
    getAllEntities();
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
        contentType: "application/json",
        cache: false
    });
}

buildAddForm = function () {
    $(addForm).empty();

    for (var key in baseEntity) {
        if (baseEntity.hasOwnProperty(key)) {
            if (key !== keyProperty) {
                $(addForm).append("<div class=\"form-group\"><label for=\"add" + key + "\" class=\"col-sm-2 control-label\">" + key + "</label><div class=\"col-sm-10\"><input type=\"text\" id=\"add" + key + "\" placeholder=\"" + entityName + " " + key + "\" class=\"form-control\"/></div></div>");
            }
        }
    }
    $(addForm).append("<div class=\"form-group\"><div class=\"col-sm-offset-2 col-sm-10\"><button id=\"entityAdd\" type=\"button\" class=\"btn btn-success\">Add " + entityName + "</button></div></div>");
}

buildEditForm = function () {
    $(editForm).empty();

    for (var key in baseEntity) {
        if (baseEntity.hasOwnProperty(key)) {
            if (key !== keyProperty) {
                $(editForm).append("<div class=\"form-group\"><label for=\"edit" + key + "\" class=\"col-sm-2 control-label\">" + key + "</label><div class=\"col-sm-10\"><input type=\"text\" id=\"edit" + key + "\" placeholder=\"" + entityName + " " + key + "\" class=\"form-control\"/></div></div>");
            } else {
                $(editForm).append("<input type=\"hidden\" id=\"edit" + key + "\" />");
            }
        }
    }

    $(editForm).append("<div class=\"form-group\"><div class=\"col-sm-offset-2 col-sm-10\"><button id=\"entityEdit\" type=\"button\" class=\"btn btn-info\">Edit Person</button><button id=\"entityDelete\" type=\"button\" class=\"btn btn-danger\">Delete Person</button><button id=\"entityCancel\" type=\"button\" class=\"btn btn-warning\">Cancel</button></div></div>");
    $(editForm).hide();
}

emptyAddForm = function () {
    for (var key in baseEntity) {
        if (baseEntity.hasOwnProperty(key)) {
            if (key !== keyProperty) {
                $("#add" + key).val("");
            }
        }
    }
}

emptyEditForm = function () {
    for (var key in baseEntity) {
        if (baseEntity.hasOwnProperty(key)) {
            if (key !== keyProperty) {
                $("#edit" + key).val("");
            }
        }
    }
}

getEntityPropertyName = function (pos) {
    var firstElement = baseEntity;
    var counter = 0;
    for (var key in firstElement) {
        if (firstElement.hasOwnProperty(key)) {
            if (pos === counter) {
                return key;
            }
            counter++;
        }
    }
}