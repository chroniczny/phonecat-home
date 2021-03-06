/**
 * Created by jkwiatkowski on 17.01.2017.
 */
'use strict';


angular.module('userNew')
    .component('userNew', {
        templateUrl: 'user-new/user-new.template.html',

        controller: ['$http',
            '$routeParams',
            function UserNewController($http, $routeParams) {
                var self = this;
                self.userId = $routeParams.userId;

                $http.get('Users/NewUser.json')
                    .then(function (response) {
                        self.user = response.data;
                        console.log("name/is before changing " + self.user.name.first + "_" + self.user.name.last);
                        localStorage.setItem(self.user.name.first + "_" + self.user.name.last, JSON.stringify(self.user));
                        self.user = JSON.parse(localStorage.getItem(self.user.name.first + "_" + self.user.name.last));
                    });

                function setDetail() { // for now: set new data to localStorage
                    // self.user = JSON.parse(localStorage.getItem(self.user.name.first + "_" + self.user.name.last));

                    var checkingId = self.user.name.first + "_" + self.user.name.last + "_" + self.user.index;
                    var checkingEmail = self.user.email;
                    // console.log(checkingId);

                    $http.get('https://a-fire.firebaseio.com/.json').then(function (response) {
                        self.users = response.data;
                        // console.log(JSON.stringify(self.users));
                        localStorage.setItem('UsersInStorage', JSON.stringify(response.data));
                    });

                    var addedUsers = JSON.parse(localStorage.getItem('UsersInStorage'));

                    //-- searching for clones
                    var checkbox = []; // for checkin: is there new user with typed name&surname already
                    for (var i = 0; i < addedUsers.length; i++) {
                        if (addedUsers[i].id === checkingId && addedUsers[i].email === checkingEmail) {
                            checkbox.push('1');
                        }
                    }
                    if (checkbox.length > 0) { // means theres no clones in base...
                        alert('Warning, there is a user called ' + checkingId);
                    }
                    // else {
                    //     self.user.id = self.user.name.first + "_" + self.user.name.last+ "_" +self.user.index;
                    //     localStorage.setItem(self.user.id, JSON.stringify(self.user));
                    //     var createdUser = localStorage.getItem(self.user.id);
                    //     console.log(addedUsers.length + " at start"); // for chceckin
                    //     addedUsers.push(JSON.parse(createdUser));
                    //     localStorage.setItem('UsersInStorage', JSON.stringify(addedUsers));
                    //     // self.users = addedUsers; // because Users are different from now...
                    //     // to check in console
                    //     console.log(createdUser);
                    //     console.log(addedUsers.length + " of users at the end");
                    // }
                    // $http.put('https://a-fire.firebaseio.com/.json', addedUsers); // changes information about whole collection
                    // // $http.post('https://a-fire.firebaseio.com/'+ (addedUsers.length) + '.json', createdUser); // creates new file 'self.user.id'.json UT as UNDEFINED object ...
                    // localStorage.removeItem(createdUser.id); // clean localStorage

                    else {
                        self.user.index = JSON.parse(localStorage.getItem('UsersInStorage')).length;
                        self.user.id = self.user.name.first + "_" + self.user.name.last + "_" + self.user.index;
                        localStorage.setItem(self.user.id, JSON.stringify(self.user));
                        var createdUser = localStorage.getItem(self.user.id);

                        $http.put('https://a-fire.firebaseio.com/' + (addedUsers.length) + '.json', createdUser);
                        localStorage.removeItem(self.user.id); // clean localStorage
                    }
                }

                /////////////////////////////to control submit form
                self.submitForm = function submitForm(isValid) {
                    if (isValid) {

                        setDetail();
                        alert('Your changes will be saved, new user is created');
                    }
                }
            }]
    });