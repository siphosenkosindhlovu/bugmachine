$(document).ready(function () {
    
    var mainForm = document.forms['signup'];
    var input = mainForm.getElementsByTagName("input");
    var tablePrev = document.getElementById("previewTable");
    var spans = tablePrev.getElementsByTagName("span");
    var formValues = {};
    var dataStore = window.localStorage;
    for (var j = 0; j < input.length - 1; j++) {
        //input[j].setAttribute('required', 'true');
    }

    console.log(input)
    var datapair;
    $('#initSub').on('click', function (e) {
        for (var i = 0; i < input.length; i++) {
            formValues[input[i].name] = input[i].value;
        };
        for (var key in formValues) {
            //console.log("id: " + key + " ; " + formValues[key])
            var currID = "#" + key;
            $(currID).text(formValues[key]);
        }
        $("#dispName").text(formValues.firstName + " " + formValues.lastName);
        datapair = $("#signature").jSignature("getData", "svgbase64");
        if (datapair) {
            var im = new Image;
            im.src = "data:" + datapair[0] + "," + datapair[1];
            $(im).appendTo($("#sigpicture"))
            formValues["signature"] = im.src;
        }
        console.log(formValues);
        console.log(mainForm);

        $("#move2").click();
        //window.location.href = window.location.href + "#stage2";
    });

    
    $('#submit').on('click', function (e) {
        //mainForm.submit()
    })
})