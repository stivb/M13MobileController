/*
    SimpleSerial index.js
    Created 7 May 2013
    Modified 9 May 2013
    by Tom Igoe
*/


var app = {
    //macAddress: "58:F1:02:C0:42:91",

    macAddress: "00:21:13:01:41:05",  // get your mac address from bluetoothSerial.list
    chars: "",

/*
    Application constructor
 */
    initialize: function() {
        if (localStorage['macAddress']!==null) app.macAddress=localStorage['macAddress'];
    },
/*
    bind any events that are required on startup to listeners:
*/


/*
    this runs when the device is ready for user interaction:
*/
    onDeviceReady: function() {
        // check to see if Bluetooth is turned on.
        // this function is called only
        //if isEnabled(), below, returns success:
        alert("readying");
        var listPorts = function() {
            // list the available BT ports:
            bluetoothSerial.list(
                function(results) {
                    app.display(JSON.stringify(results));
                },
                function(error) {
                    app.display(JSON.stringify(error));
                }
            );
        }

        // if isEnabled returns failure, this function is called:
        var notEnabled = function() {
            app.display("Bluetooth is not enabled.")
        }

         // check if Bluetooth is on:
        bluetoothSerial.isEnabled(
            listPorts,
            notEnabled
        );
    },
/*
    Connects if not connected, and disconnects if connected:
*/

	sendTextOff: function (iput) {
	    //alert("sending off " + iput);

        bluetoothSerial.isConnected(
            function() {
                console.log("Bluetooth is connected");
            },
            function() {
                alert("Bluetooth is *not* connected");
            }
        );

        bluetoothSerial.write(iput, function(err, bytesWritten) {
            if (err) alert("error in writing: " + err + "\n Text to be written was: " + iput);
        });
    },

    sendText: function() {
	var theMsg = localStorage['setList'];
	theMsg = theMsg + '\n';
	alert("Writing : " + theMsg);
	
	bluetoothSerial.isConnected(
		function() {
			console.log("Bluetooth is connected");
		},
		function() {
			console.log("Bluetooth is *not* connected");
		}
	);
	
	bluetoothSerial.write(theMsg, function(err, bytesWritten) {
                if (err) alert("error" + err.message);
            });
	},

    setMacAddress: function(iput) {
	    app.macAddress = iput;
    },
	
    manageConnection: function() {


        // connect() will get called only if isConnected() (below)
        // returns failure. In other words, if not connected, then connect:
        var connect = function () {
			
            // if not connected, do this:
            // clear the screen and display an attempt to connect
            app.clear();
            alert("Attempting to connect to " + app.macAddress);
            // attempt to connect:
            bluetoothSerial.connect(
                app.macAddress,  // device to connect to
                app.openPort,    // start listening if you succeed
                app.showError    // show the error if you fail
            );
        };

        // disconnect() will get called only if isConnected() (below)
        // returns success  In other words, if  connected, then disconnect:
        var disconnect = function () {
            app.display("attempting to disconnect");
            // if connected, do this:
            bluetoothSerial.disconnect(
                app.closePort,     // stop listening to the port
                app.showError      // show the error if you fail
            );
        };

        // here's the real action of the manageConnection function:
        //bluetoothSerial.isConnected(disconnect, connect);

        bluetoothSerial.connect(
            app.macAddress,  // device to connect to
            app.openPort,    // start listening if you succeed
            app.showError    // show the error if you fail
        );
    },
/*
    subscribes to a Bluetooth serial listener for newline
    and changes the button:
*/
    openPort: function() {
        // if you get a good Bluetooth serial connection:
        app.display("Connected to: " + app.macAddress);
        // change the button's name:
        connectButton.innerHTML = "Disconnect";
        // set up a listener to listen for newlines
        // and display any new data that's come in since
        // the last newline:
        bluetoothSerial.subscribe('\n', function (data) {
            app.clear();
            app.display(data);
        });
    },

/*
    unsubscribes from any Bluetooth serial listener and changes the button:
*/
    closePort: function() {
        // if you get a good Bluetooth serial connection:
        app.display("Disconnected from: " + app.macAddress);
        // change the button's name:
        connectButton.innerHTML = "Connect";
        // unsubscribe from listening:
        bluetoothSerial.unsubscribe(
                function (data) {
                    app.display(data);
                },
                app.showError
        );
    },
/*
    appends @error to the message div:
*/
    showError: function(error) {
		alert("error!");
        app.display(error);
    },

/*
    appends @message to the message div:
*/
    display: function(message) {
        alert(message);
        var display = document.getElementById("divMessage"), // the message div
            lineBreak = document.createElement("br"),     // a line break
            label = document.createTextNode(message);     // create the label

        display.appendChild(lineBreak);          // add a line break
        display.appendChild(label);              // add the message node
    },
/*
    clears the message div:
*/
    clear: function() {
        var display = document.getElementById("message");
        display.innerHTML = "";
    }
};      // end of app
