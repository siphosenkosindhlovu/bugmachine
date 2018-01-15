(function(){
    angular.module("bugmachine")
        .factory('localHelper', [localHelper])

    function localHelper(){
        var storage = window.localStorage
        var localHelper = {
            addToStorage: addToStorage,
            retriveFromStorage: retriveFromStorage,
            deleteFromStorage: deleteFromStorage,
            checkStorage: checkStorage
        }

        function addToStorage(formObj){
            if(!(storage.getItem(formObj.cardnum))) storage.setItem(formObj.cardnum, JSON.stringify(formObj));
        };

        function retriveFromStorage(){
            var accounts = []
            if(checkStorage()){
                for(var i = 0; i < storage.length; i++){
                    accounts.push(JSON.parse(storage.getItem(storage.key(i))))
                }
            }else{
                return false;
            }
            return accounts;
        }

        function checkStorage(){
            if(storage.length > 0){
                return true;
            }else{
                return false;
            }
        }

        function deleteFromStorage(key){
            if(storage.getItem(key)){
                storage.removeItem(key);
                return true;
            }else{
                return false;
            }
        }

        return localHelper;
    }
})()