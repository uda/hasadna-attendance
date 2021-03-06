
var database = firebase.database();

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // . (dot) is an invalid character in Firebase keys
        var userEmailKey = user.email.split('.').join(',');

        return database.ref('/users/' + userEmailKey).once('value').then(function (snapshot) {
            if (snapshot.val() && !snapshot.val().uid) {
                return firebase.database().ref('/users/' + userEmailKey).update({
                    uid: user.uid
                });
            }

            return true;
        }).then(function (result) {
            var d = new Date();
            var dateDateString = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
            var dateJSONString = d.toJSON();
            var updateObject = {};
            updateObject['/users/' + userEmailKey + '/attended/' + dateDateString] = dateJSONString;
            updateObject['/attendance/' + dateDateString + '/' + userEmailKey] = dateJSONString;
            return database.ref().update(updateObject);
        }).then(function (result) {
            document.getElementById('feedback').textContent = 'נרשמת בהצלחה!';
        }).catch(function (error) {
            document.getElementById('feedback').textContent = 'התרחשה שגיאה. עשינו לוג לקונסול.';
            console.log(error.code, error.message);
        });
    } else {
        window.location.href = '/auth.html';
    }
});



//Does the link refresh the pages?
function signOut () {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
    }, function (error) {
        // An error happened.
    });
}
