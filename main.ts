
//% color="#0082FC" icon="\uf293" block="PKS Driver"
namespace pksdriver {

    // it is not a good idea to use global variables but i dont care
    let connected = false;

    /**
     * Enable Bluetooth and set up the remote GUI application framework.
     * You must use this before using all the other bluetooth blocks
     */
    //% blockId=pksdriver_bluetooth_setup block="setup bluetooth" subcategory="Bluetooth"
    //% group="Bluetooth"
    //% weight=99
    export function setupBluetooth(): void {

        bluetooth.startUartService();

        control.onEvent(DAL.MICROBIT_ID_BLE, DAL.MICROBIT_BLE_EVT_CONNECTED, function () {
            connected = true;
            basic.showLeds(`
                . . . . #
                . . . # .
                # . # . .
                . # . . .
                . . . . .
            `);
        });
        
        control.onEvent(DAL.MICROBIT_ID_BLE_UART, DAL.MICROBIT_UART_S_EVT_DELIM_MATCH, function () {
            
            // Read the data buffer up until the newline marker
            let receivedString = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine));
            console.log(receivedString)
        });

        control.onEvent(DAL.MICROBIT_ID_BLE, DAL.MICROBIT_BLE_EVT_DISCONNECTED, function () {
            connected = false;
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

        control.inBackground(() => {
            while (!connected) {
                basic.showString(control.deviceName())
                basic.pause(200)
            }
        })

    }

    /**
     * will tell you if microbit is connected to bluetooth or not
     */
    //% blockId=pksdriver_bluetooth_connected block="bluetooth is connected" subcategory="Bluetooth"
    //% group="Bluetooth"
    //% weight=98
    export function isConnected(): boolean {
        return connected;
    }

    /**
     * wait until you are connected to bluetooth
     * blocks next block
     */
    //% blockId=pksdriver_bluetooth_waitconn block="wait until bluetooth is connected" subcategory="Bluetooth"
    //% group="Bluetooth"
    //% weight=98
    export function waitUntilConnected(): void {
        while (!connected) {
            basic.pause(200)
        }
        console.log("done connected")
        // it actually takes like 1.4s for the connection to be stable 
        // so this exist to have a little buffer
        for (let i=0; i<10; i++) {
            console.log(`test send ${i}`)
            bluetooth.uartWriteLine("hi")
            basic.pause(200)
        }
    }

    

    /**
     * make configuration for GUI based on what you put in here.\n  
     * you must be connected to bluetooth!
     * @param configs The configuration list
     */
    // TODO: update subcategory in the future
    //% color="#f150f1"
    //% blockId=pksdriver_bluetooth_makeconfig block="make configuration with $configs" subcategory="Bluetooth"
    //% configs.shadow="lists_create_with"
    //% configs.defl="pksdriver_bluetooth_button"
    //% group="Configuration"
    //% weight=98
    export function makeConfiguration(configs: string[]): void {
        let config_string = `C,I,${configs.length},`
        if (configs.some(item => item.includes("O,"))) {
            config_string=`C,I,${configs.length-1},`
        }
        config_string += configs.join(",")
        config_string += "\n"

        if (!connected) {
            basic.showIcon(IconNames.No);
            return;
        }
        // TODO: additional processing for plot is needed (i think)
        // PROCESSING GOES HERE...

        console.log(`send data: ${config_string}`)
        // automatically determine how long the configs are
        bluetooth.uartWriteLine(config_string)
    }

    /**
     * Creates a slider
     * @param min The minimum value of slider (>0), eg: 1
     * @param max The maximum value of slider (<=255), eg: 255
     * @param name The name of the slider
     */
    //% color="#f150f1"
    //% min.defl=0
    //% max.defl=255
    //% name.defl="Slider"
    //% blockId=pksdriver_bluetooth_slider block="create slider $min $max $name" subcategory="Bluetooth"
    //% group="Configuration"
    export function createSlider(min: number, max: number, name: string): String {

        // silently change min/max if they are set to the wrong value
        if (min > max) {
            const temp = min
            min = max
            max = temp
        }
        const output: string = `S,${min},${max},${name}`
        return output

    }

    /**
     * Creates a button
     * @param name The name of the button
     */
    //% color="#f150f1"
    //% name.defl="Button"
    //% blockId=pksdriver_bluetooth_button block="create button $name" subcategory="Bluetooth"
    //% group="Configuration"
    export function createButton(name: string): string {
        const output: string = `B,${name}`;
        return output;
    }

    /**
     * Creates a toggle button
     * @param name The name of the toggle button
     */
    //% color="#f150f1"
    //% name.defl="ToggleButton"
    //% blockId=pksdriver_bluetooth_toggle_button block="create toggle button $name" subcategory="Bluetooth"
    //% group="Configuration"
    export function createToggleButton(name: string): string {
        const output: string = `TB,${name}`;
        return output;
    }

    /**
     * Creates a text field
     * @param name The name of the text field
     */
    //% color="#f150f1"
    //% name.defl="TextField"
    //% blockId=pksdriver_bluetooth_textfield block="create text field $name" subcategory="Bluetooth"
    //% group="Configuration"
    export function createTextField(name: string): string {
        const output: string = `TF,${name}`;
        return output;
    }

    /**
     * Creates a joystick
     * @param anglename The name of the angle
     * @param smax The maximum value of the joystick
     * @param strengthName The name of the strength
     * @param joystickName The name of the joystick
     */
    //% color="#f150f1"
    //% anglename.defl="angle1"
    //% smax.min=0 smax.defl=255
    //% strengthName.defl="strength1"
    //% joystickName.defl="Joystick"
    //% blockId=pksdriver_bluetooth_joystick block="create joystick $joystickName angle $anglename max strength $smax strength $strengthName" subcategory="Bluetooth"
    //% group="Configuration"
    export function createJoystick(anglename: string, smax: number, strengthName: string, joystickName: string): string {
        const output: string = `J,${anglename},${smax},${strengthName},${joystickName}`;
        return output;
    }

    /**
     * Creates a single variable configuration.
     * @param name The name of the variable
     * @param isPlotable Whether the variable is plotable
     */
    //% color="#a000a0"
    //% name.defl="var1"
    //% blockId=pksdriver_bluetooth_var block="variable $name plotable $isPlotable" subcategory="Bluetooth"
    //% group="Configuration"
    export function createVariable(name: string, isPlotable: boolean): string {
        // Returns a formatted string for this single variable
        return `${name},${isPlotable}`;
    }

    /**
     * Formats a list of variables into the final configuration string.
     * @param vars The list of variable strings
     */
    //% color="#f150f1"
    //% blockId=pksdriver_bluetooth_varlist block="variables $vars" subcategory="Bluetooth"
    //% group="Configuration"
    //% vars.shadow="lists_create_with"
    //% vars.defl="pksdriver_bluetooth_var"
    export function formatVariablesList(vars: string[]): string {
        // Start with the prefix and the length of the list
        let output: string = `O,${vars.length}`;
        
        // Append each variable string from the list
        for (let i = 0; i < vars.length; i++) {
            output += `,${vars[i]}`;
        }
        
        return output;
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