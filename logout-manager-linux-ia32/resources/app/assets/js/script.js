var $ = require('jquery');
var shell = require('shelljs');
shell.config.execPath = '/usr/bin/node';
const remote = require('electron').remote;

var contents = ["#poweroff",
                "#reboot",
                "#hibernate",
                "#suspend",
                "#logout",
                "#lock"];


let idx = 0, beforeIdx = 0;

$(document).ready(function () {
    $("body").on("keydown", function (event) {
        console.log("which : "+event.which);

        if (event.which == 73) {
            event.preventDefault();
        }
        else if (event.which == 37) {
            //left
            beforeIdx = idx;
            if (idx-1 < 0) {
                idx = 5;
            }
            else {
                idx--;
            }
            
            changeSelected();
        }
        else if (event.which == 39) {
            //right
            beforeIdx = idx;
            if (idx+1 > 5) {
                idx = 0;
            }
            else {
                idx++;
            }

            changeSelected();
        }
        else if (event.which == 27) {
            //esc
            remote.getCurrentWindow().close();
        }
        else if (event.which == 13) {
            //enter
            //execute command
            executeCommand();
        }
    });

    $(".item").mouseenter(function () {
        let id = $(this).attr("id");
        beforeIdx = idx;
        idx = contents.indexOf("#"+id);

        changeSelected();
    });

    $(".item").on("click", function () {
        //execute command
        executeCommand();
    });

    $("#closeBtn").on("click", function () {
        remote.getCurrentWindow().close();
    })
});

function changeSelected() {
    if (beforeIdx != idx) {
        $(contents[beforeIdx]).removeClass("selected");
        $(contents[idx]).addClass("selected");
    }
}

function executeCommand() {
    if (idx == 0) {
        shell.exec("echo '>poweroff'");
        shell.exec("poweroff");
    }
    else if (idx == 1) {
        shell.exec("echo '>reboot'");
        shell.exec("reboot");
    }
    else if (idx == 2) {
        shell.exec("echo '>hibernate'");
        shell.exec("systemctl hibernate");
    }
    else if (idx == 3) {
        shell.exec("echo '>suspend'");
        shell.exec("systemctl suspend");
    }
    else if (idx == 4) {
        shell.exec("echo '>logout'");
        shell.exec("openbox --exit");
    }
    else if (idx == 5) {
        shell.exec("echo '>lock'");
        shell.exec("dm-tool lock");
    }

    //then close current window
    remote.getCurrentWindow().close();
}