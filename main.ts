/**
 * Custom Bluetooth Extension
 */
//% color="#0082FC" icon="\uf293" block="PKS Driver"
namespace pksdriver {

    let connected = false;
    let loopInitialized = false;

    /**
     * Enable Bluetooth and set up the remote GUI application framework.
     */
    //% blockId=pksdriver_bluetooth_setup block="setup bluetooth" subcategory="Bluetooth"
    //% group="Bluetooth"
    //% weight=99
    export function setupBluetooth(): void {

        bluetooth.startUartService();

        bluetooth.onBluetoothConnected(function () {
            connected = true;
            // Show a checkmark/tick on connection
            basic.showLeds(`
                . . . . #
                . . . # .
                # . # . .
                . # . . .
                . . . . .
            `);
        });

        bluetooth.onBluetoothDisconnected(function () {
            connected = false;
        });

        // Initialize the background transmission loop ONLY once globally
        if (!loopInitialized) {
            loopInitialized = true;
            loops.everyInterval(500, function on_every_interval() {
                // Only send data if a device is actively connected
                if (connected) {
                    bluetooth.uartWriteLine("C,I,12,B,button1,B,button2,B,button3,B,button4,B,button5,B,button6,B,button7,S,0,255,slider1,S,0,255,slider2,S,0,255,slider3,TB,toggleButton1,TB,toggleButton2,O,3,hello,true,world,true,ggez,true,haha,false");
                }
            });
        }
    }

    /**
     * Setup the hardware button handlers to send telemetry data over Bluetooth.
     */
    //% blockId=pksdriver_bluetooth_setup_handlers block="setup bluetooth handlers" subcategory="Bluetooth"
    //% group="Bluetooth"
    //% weight=98
    export function initializeButtonHandlers(): void {
        
        // When pressing button A, send random graph/telemetry values
        input.onButtonPressed(Button.A, () => {
            if (connected) {
                let v1 = Math.randomRange(0, 255);
                let v2 = Math.randomRange(0, 255);
                let v3 = Math.randomRange(0, 255);
                let v4 = Math.randomRange(0, 255);
                bluetooth.uartWriteLine("R,hello," + v1 + ",world," + v2 + ",ggez," + v3 + ",haha," + v4);
            }
        });

        // When pressing button B, send fixed max values
        input.onButtonPressed(Button.B, () => {
            if (connected) {
                bluetooth.uartWriteLine("R,hello,512,world,512,ggez,512,haha,512");
            }
        });
    }
}