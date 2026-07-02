
//% color="#0082FC" icon="\uf293" block="PKS Driver"
namespace pksdriver {

    /**
     * Enable Bluetooth and set up the remote GUI application framework.
     * You must use this before using all the other bluetooth blocks
     */
    //% blockId=pksdriver_bluetooth_setup block="setup bluetooth" subcategory="Bluetooth"
    //% group="Bluetooth"
    //% weight=99
    export function setupBluetooth(): void {

        bluetooth.startUartService();

        bluetooth.onBluetoothConnected(function () {
            basic.showLeds(`
                . . . . #
                . . . # .
                # . # . .
                . # . . .
                . . . . .
            `);
        });


        control.inBackground(() => {
            // send config for 10s should be enough right?
            for (let i=0; i<20; i++) {
                bluetooth.uartWriteLine("C,I,12,B,button1,B,button2,B,button3,B,button4,B,button5,B,button6,B,button7,S,0,255,slider1,S,0,255,slider2,S,0,255,slider3,TB,toggleButton1,TB,toggleButton2,O,3,hello,true,world,true,ggez,true,haha,false");
                basic.pause(500)
            }
        });

    }

    /**
     * Test function to test if sending data through bluetooth works.
     */
    //% blockId=pksdriver_bluetooth_setup_handlers block="setup bluetooth handlers" subcategory="Bluetooth"
    //% group="Bluetooth"
    //% weight=98
    export function initializeButtonHandlers(): void {
        
        // When pressing button A, send random values
        input.onButtonPressed(Button.A, () => {
            let v1 = Math.randomRange(0, 255);
            let v2 = Math.randomRange(0, 255);
            let v3 = Math.randomRange(0, 255);
            let v4 = Math.randomRange(0, 255);
            bluetooth.uartWriteLine("R,hello," + v1 + ",world," + v2 + ",ggez," + v3 + ",haha," + v4);
        });

        // When pressing button B, send fixed values
        input.onButtonPressed(Button.B, () => {
            bluetooth.uartWriteLine("R,hello,512,world,512,ggez,512,haha,512");
        });
    }

    /**
     * show the device name if it is not connected to bluetooth
     */
    //% blockId=pksdriver_bluetooth_showdname block="display micro:bit name" subcategory="Bluetooth"
    //% group="Bluetooth"
    //% weight=98
    export function showDeviceName(): void {
        // idk if this is actually needed but in case the children are so stupid that they don't know what
        // their device name is i made this function to show them what it is
        bluetooth.onBluetoothDisconnected(() => {
            basic.showString(control.deviceName())
        })
    }
}

/*
DEBUGGING PURPOSES ONLY
original code:

function initializeBluetooth() {

    // set up the bluetooth config that 

    bluetooth.startUartService()

    bluetooth.onBluetoothConnected(function () {
        basic.showLeds(`
        . . . . #
        . . . # .
        # . # . .
        . # . . .
        . . . . .
        `)
        loops.everyInterval(500, function on_every_interval() {
            // this is the config data that should be sent to the app 
            // to set up the GUI 
            bluetooth.uartWriteLine("C,I,12,B,button1,B,button2,B,button3,B,button4,B,button5,B,button6,B,button7,S,0,255,slider1,S,0,255,slider2,S,0,255,slider3,TB,toggleButton1,TB,toggleButton2,O,3,hello,true,world,true,ggez,true,haha,false")
        })
    })
}

function intializeButtonHandlers() {
    // what this does is that when u press button A, it will send the line below
    input.onButtonPressed(Button.A, () => {
        bluetooth.uartWriteLine("R,hello," + randint(0, 255) + ",world," + randint(0, 255) + ",ggez," + randint(0, 255) + ",haha," + randint(0, 255))
    })

    // same as above but with button B, all values are set to 512
    input.onButtonPressed(Button.B, () => {
        bluetooth.uartWriteLine("R,hello," + 512 + ",world," + 512 + ",ggez," + 512 + ",haha," + 512)
    })

}

initializeBluetooth()
intializeButtonHandlers()
*/