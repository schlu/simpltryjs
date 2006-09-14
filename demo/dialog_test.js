function alertBox () {
    Dialog.Alert("This is an alert box");
}

function confirmBox() {
    var confirm = new Dialog.Confirm({additionalText: "Do you accept the terms?",title: "CONFIRM!!!"}, [
        {text: "yes", onClick: function(){alert("pressed yes")}},
        {text: "no", onClick: function(){alert("pressed no")}}
        ]);
    confirm.show();
}

function ajaxDialog() {
    var ajaxD = new Dialog.Ajax({url: "dialog_ajax.html"});
    ajaxD.show();
}