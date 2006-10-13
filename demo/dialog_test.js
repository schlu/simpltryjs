function alertBox () {
    Simpltry.Dialog.Alert("This is an alert box");
}

function confirmBox() {
    new Simpltry.Dialog.Confirm({additionalText: "Enter your name: <input id='name' type='text' name='name' />",title: "CONFIRM!!!"}, [
        {text: "first", onClick: function(){alert("your first name is " + $('name').value + "?  wierd")}},
        {text: "last", onClick: function(){alert("your last name is " + $('name').value + "?  wierd")}}
        ]);
}

function ajaxDialog() {
    new Simpltry.Dialog.Ajax({url: "dialog_ajax.html"});
}