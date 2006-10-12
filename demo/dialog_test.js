function alertBox () {
    Simpltry.Dialog.Alert("This is an alert box");
}

function confirmBox() {
    new Simpltry.Dialog.Confirm({additionalText: "Do you accept the terms?",title: "CONFIRM!!!"}, [
        {text: "yes", onClick: function(){alert("pressed yes")}},
        {text: "no", onClick: function(){alert("pressed no")}}
        ]);
}

function ajaxDialog() {
    new Simpltry.Dialog.Ajax({url: "dialog_ajax.html"});
}