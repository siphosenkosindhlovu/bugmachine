$(document).ready(function () {
    //var xhr = new XMLHttpRequest;


    // Before using it we must add the parse and format functions
    // Here is a sample implementation using moment.js
    validate.extend(validate.validators.datetime, {
        // The value is guaranteed not to be null or undefined but otherwise it
        // could be anything.
        parse: function (value, options) {
            return +moment.utc(value);
        },
        // Input is a unix timestamp
        format: function (value, options) {
            var format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
            return moment.utc(value).format(format);
        }
    });

    // These are the constraints used to validate the form
    var constraints = {
        firstName: {
            // Email is required
            presence: true,
            format: {
                pattern: "[a-z\w]+",
                flags: "i",
                message: "cannot contain numbers"
            }
        },
        lastName: {
            // Password is also required
            presence: true,
            format: {
                // We don't allow anything that a-z and 0-9
                pattern: "[a-z\w]+",
                // but we don't care if the username is uppercase or lowercase
                flags: "i",
                message: "cannot contain numbers"
            }
        },
        dob: {
            // You need to confirm your password
            presence: true,
            // and it needs to be equal to the other password
            datetime: {
                dateOnly: true,
                message: "Date should be in the format YYYY-MM-DD"
            }
        },
        idnumber: {
            presence: true,
            format: {
                // We don't allow anything that a-z and 0-9
                pattern: "[0-9]{2}\-[0-9]{7}\ {1}[A-Z]\ {1}[0-9]{2}",
                // but we don't care if the username is uppercase or lowercase
                flags: "i",
                message: "Incorrect format. It should be XX-XXXXXXX X XX"
            }
        },
        address: {
            // The user needs to give a birthday
            presence: true,
            // and must be born at least 18 years ago
        },
        city: {
            // You also need to input where you live
            presence: true,
            // And we restrict the countries supported to Sweden
        },
        province: {
            presence: true,
        },
        phone: {
            presence: true,
            // Zip is optional but if specified it must be a 5 digit long number
            format: {
                pattern: "[0-9]{12}",
                message: "Number should be in the format 263777123456 (that without the '+'"
            }
        },
        cardnum: {
            presence: true,
        },
        headpicture: {
            presence: true,
        },
        idpicture: {
            presence: true,
        },
        proofpicture: {
            presence: true,
        }
    };

    // Hook up the form so we can prevent it from being posted
    var form = document.querySelector("form#signup");
    form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        showSuccess()
        //handleFormSubmit(form);
    });

    // Hook up the inputs to validate on the fly
    var inputs = document.querySelectorAll("input, textarea, select")
    for (var i = 0; i < inputs.length; ++i) {
        console.log(inputs[i])
        inputs.item(i).addEventListener("change", function (ev) {
            var errors = validate(form, constraints) || {};
            showErrorsForInput(this, errors[this.name])
        });
    }

    function handleFormSubmit(form, input) {
        // validate the form aainst the constraints
        console.log(form)
        var errors = validate(form, constraints);
        // then we update the form to reflect the results
        showErrors(form, errors || {});
        if (!errors) {
            showSuccess();
        }
    }

    // Updates the inputs with the validation errors
    function showErrors(form, errors) {
        // We loop through all the inputs and show the errors for that input
        _.each(form.querySelectorAll("input[name], select[name]"), function (input) {
            // Since the errors can be null if no errors were found we need to handle
            // that
            showErrorsForInput(input, errors && errors[input.name]);
        });
    }

    // Shows the errors for a specific input
    function showErrorsForInput(input, errors) {
        // This is the root of the input
        var formGroup = closestParent(input.parentNode, "form-group")
            // Find where the error messages will be insert into
            ,
            messages = formGroup.querySelector(".messages");
        // First we remove any old messages and resets the classes
        resetFormGroup(formGroup);
        // If we have errors
        if (errors) {
            // we first mark the group has having errors
            formGroup.classList.add("has-error");
            // then we append all the errors
            _.each(errors, function (error) {
                addError(messages, error);
                console.log(messages)
            });
        } else {
            // otherwise we simply mark it as success
            formGroup.classList.add("has-success");
        }
    }

    // Recusively finds the closest parent that has the specified class
    function closestParent(child, className) {
        if (!child || child == document) {
            return null;
        }
        if (child.classList.contains(className)) {
            return child;
        } else {
            return closestParent(child.parentNode, className);
        }
    }

    function resetFormGroup(formGroup) {
        // Remove the success and error classes
        formGroup.classList.remove("has-error");
        formGroup.classList.remove("has-success");
        // and remove any old messages
        _.each(formGroup.querySelectorAll(".help-block.error"), function (el) {
            el.parentNode.removeChild(el);
        });
    }

    // Adds the specified error with the following markup
    // <p class="help-block error">[message]</p>
    function addError(messages, error) {
        var block = document.createElement("p");
        block.classList.add("help-block");
        block.classList.add("error");
        block.innerText = error;
        messages.appendChild(block);
    }

    function showSuccess() {
        // We made it \:D/
        collectCompute();
        $("#move2").click();
        alert("Success!");
    }

    var mainForm = document.forms['signup'];
    var input = mainForm.getElementsByTagName("input");
    var tablePrev = document.getElementById("previewTable");
    var spans = tablePrev.getElementsByTagName("span");
    var formValues = {}
    for (var j = 0; j < input.length - 1; j++) {
        //input[j].setAttribute('required', 'true');
    }
    //collects form data and put it in an objeect
    function collectCompute() {
        for (var i = 0; i < input.length; i++) {
            if (input[i].type !== "file") {
                formValues[input[i].name] = input[i].value;
            } else {
                readURL(input[i]);
            }
        };
        for (var key in formValues) {
            var currID = "#" + key;
            if (formValues[key].slice(0, 5) !== "data:") {
                $(currID).text(formValues[key]);
                //console.log(formValues[key].slice(0,5))
            } else {
                $(currID).attr("src", formValues[key])
                $(currID).css({
                    width: "200px",
                    height: "200px"
                })
            }
        };
        var datapair;
        datapair = $("#signature").jSignature("getData", "svgbase64");
        if (datapair) {
            var im = new Image;
            var sauce = "data:" + datapair[0] + "," + datapair[1];
            formValues['signature'] = sauce;
            $("#sigpicture").attr("src", sauce);
            $("#signature").jSignature("reset");
        }
        $("#dispName").text(formValues.firstName + " " + formValues.lastName);
    }
    //convert image to a data url string and add to the object
    function readURL(input) {
        //document.getElementById("bannerImg").style.display = "block";
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                formValues[input.name] = String(e.target.result)
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    $("input[type=file]").on("change", function (e) {
        readURL(e.target);
    });

    $("#tandc").on('click', function (e) {

        if (e.target.checked) {
            $('#submit').attr("disabled", false);
            console.log(e.target.checked)
        } else {
            $('#submit').attr("disabled", true);
        }
    })
    //Handles errors if there is an issue connecting to server
    function xhrerrorhandler(pendingform) {
        var pendingForm = pendingform;
        console.log(pendingForm)
        if (!localStorage.getItem(pendingForm.cardnum)){
            localStorage.setItem(pendingForm.cardnum, JSON.stringify(pendingForm));
            console.log(localStorage.getItem(pendingForm.cardnum));
        }else{
            console.log("What else")
        }
        setTimeout(function () {
            $(".loader-custom").addClass("loaded-fail");
            $("#messageDisp").html('<h3>Connection error<small> Data will be uploaded once a connection is established and you will recieve a confirmation SMS');
        }, 1500)
        console.log("Stored")
    }

    $("#finaSubmit").on('click', function (e) {
        e.preventDefault();
        submitHandler(formValues);
        //$().click();
    })

    function submitHandler(submitForm) {
        var formObj = submitForm;
        formObj.agent = localStorage.getItem('username');
        console.log(formObj);
        var fd = new FormData();
        for (var key in formObj) {
            fd.append(key, formObj[key]);
        }
        $.ajax({
            url: 'api/upload',
            method: "POST",
            data: formObj,
            success: function (result) {
                setTimeout(function () {
                    $(".loader-custom").addClass("loaded-success");
                    $("#messageDisp").html('<h3>Success<small> Request sent. Your account is being prepared and you will recieve a confirmation SMS');
                    console.log("Submitted");
                }, 1500)

            },
            error: function (error) {
                //xhrerrorhandler(formObj);
            },
            timeout: 3000
        })
    }

    /*function loadLocal() {
        if (window.localStorage.length !== 0) {
            var len = window.localStorage.length;
            var form = {};
            while (len--) {
                var key = localStorage.key(len)
                if(key !== "Authorized" || key !== "username"){
                    form = JSON.parse(localStorage.getItem(key));
                    submitHandler(form);
                }
            }
        }
    }*/

})