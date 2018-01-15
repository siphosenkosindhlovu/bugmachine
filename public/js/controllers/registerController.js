(function () {
    'use strict';

    angular
        .module('bugmachine')
        .controller('RegisterController', [
            '$scope',
            '$state',
            'submitinator',
            'localHelper',
            registerController
        ]);



    function registerController($scope, $state, submitinator, localHelper) {
        var vm = this;
        this.firstName = "Sipho"
        vm.formData = {};
        vm.width = 0
        vm.progress = {
            width : vm.width + "px"
        }
        vm.fileData = {};
        vm.responseText;
        vm.success = false;
        vm.error = false;
        $scope.onChange = function (e, fileList) {
            alert('this is on-change handler!');
        };
        vm.saveSig = function () {
            var datapair = $('#signature').jSignature("getData", "svgbase64");
            var i = new Image()
            i.src = "data:" + datapair[0] + "," + datapair[1];
            vm.formData.signature = i.src;
        }
        vm.resetSig = function () {
            $('#signature').jSignature("reset");
        }


        vm.processForm = function () {
            
            var form = document.querySelector("#signup");
            console.log(form);

            handleFormSubmit(form);
            vm.formData.idpicture = "data:" + vm.fileData.idpicture.filetype + ";base64," + vm.fileData.idpicture.base64;
            vm.formData.proofpicture = "data:" + vm.fileData.proofpicture.filetype + ";base64," + vm.fileData.proofpicture.base64;
            vm.formData.headpicture = "data:" + vm.fileData.headpicture.filetype + ";base64," + vm.fileData.headpicture.base64;
            alert('Change');
        }

        vm.submit = function () {
            submitinator.submit(vm.formData)
                .then(function (response) {
                    vm.width = '100%';
                    $state.go(
                        'register.final'
                    )
                    vm.success = true;
                    vm.error = false;
                    vm.responseText = response.data.message;
                }).catch(function (response) {  
                    if(response.status < 0){
                        vm.responseText = "Unauthorised"
                    }else{
                        console.log(response);
                    }
                    $state.go(
                        'register.final'
                    )
                    vm.success = false;
                    vm.error = true;
                    localHelper.addToStorage(vm.formData.cardnum)
                })
        }


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
            vm.width = '50%';
            $state.go(
                'register.step2'
            )
        }
    }
})()