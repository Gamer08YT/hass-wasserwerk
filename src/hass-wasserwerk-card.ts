import {HomeAssistant} from "custom-card-helpers";
import {customElement} from 'lit/decorators.js';

// @ts-ignore
import styles from "./hass-wasserwerk-card.css";

// @ts-ignore
import templateIO from "../card.html";

// @ts-ignore
import flashOn from "../images/flash-on.svg";
// @ts-ignore
import flashOff from "../images/flash-off.svg";

// @ts-ignore
@customElement("hass-wasserwerk-card")
class HassWasserwerkCard extends HTMLElement {
    // Store Hass Instance.
    private hassIO: HomeAssistant;

    // Store Config Instance.
    protected configIO;

    // Store State of Dropping Animation.
    protected droppingIO = false;

    private timerIO = null;

    /**
     * Callback for Value Change / Initialisation in Hass.
     * @param hassIO
     */
    set hass(hassIO: HomeAssistant) {
        // Set Hass Instance.
        this.hassIO = hassIO;

        // Set Inner if not set.
        if (this.innerHTML == undefined || this.innerHTML == null || this.innerHTML == "") {
            // Import Styles from Webpack.
            this.innerHTML += "<style type='text/css'>" + styles + "</style>";

            // Import HTML Template from Webpack.
            this.innerHTML += String(templateIO).replace("%header%", (this.configIO.title == undefined ? "Wasserwerk" : this.configIO.title));

            this.setupPump(1, (this.configIO.pump[0].name == undefined ? "Pump 1" : this.configIO.pump[0].name));
            this.setupPump(2, (this.configIO.pump[1].name == undefined ? "Pump 2" : this.configIO.pump[1].name));
            this.setupPump(3, (this.configIO.pump[2].name == undefined ? "Pump 3" : this.configIO.pump[2].name));

            // Start Animation Interval.
            this.startAnimation();
        }

        // Parse Entity State.
        const arrayIO = this.configIO.pump;

        // Loop trough Entity Array.
        if (arrayIO instanceof Array) {
            for (const rowIO in arrayIO) {
                const entityIO = arrayIO[rowIO];

                // @ts-ignore
                const stateIO = this.hassIO.states[entityIO.entity];
                const valueIO = stateIO ? stateIO.state : "unavailable";

                // Set Value of Pump.
                this.setPump(parseInt(rowIO, 0) + 1, valueIO);

                if (rowIO == "2") {
                    this.handleFlow(valueIO);
                }
            }
        }
    }

    /**
     * Config Implementation.
     * @param configIO
     */
    setConfig(configIO) {
        if (!configIO.pump[0].entity) {
            throw new Error("You need to define pump 1 (Array: 0) entity");
        }

        if (!configIO.pump[1].entity) {
            throw new Error("You need to define pump 2 (Array: 1) entity");
        }

        if (!configIO.pump[2].entity) {
            throw new Error("You need to define pump 3 (Array: 2) entity");
        }

        // Override Config.
        this.configIO = configIO;
    }

    /**
     * Get Stub Config.
     */
    getStubConfig() {
        return {
            entity: "",
            title: "Wasserwerk"
        }
    }

    getCardSize() {
        return 3;
    }

    private setPump(rowIO: number, dataIO: string) {
        const elementIO = this.querySelector("#pump-card-" + rowIO);

        if (elementIO != undefined && elementIO != null) {
            const textIO = elementIO.querySelector(".card-text");
            const valueIO = textIO.querySelector("span");

            if (valueIO != undefined && valueIO != null)
                valueIO.innerText = dataIO + "W";

            // Get Image Element from Card.
            const imageIO = elementIO.querySelector("img");

            if (imageIO != undefined && imageIO != null) {
                // Check if Watt Usage is bigger than 10W.
                this.setImageState(Number(dataIO) > 10, imageIO);
            }
        }
    }

    private setupPump(rowIO: number, dataIO: string) {
        const elementIO = this.querySelector("#pump-card-" + rowIO);

        if (elementIO != undefined && elementIO != null) {
            const textIO = elementIO.querySelector(".card-text");
            const valueIO = textIO.querySelector("h3");

            if (valueIO != undefined && valueIO != null)
                valueIO.innerText = dataIO;
        }
    }

    private startAnimation() {
        let stateIO = 0;

        if (this.timerIO == null) {
            console.log("Starting Animation Interval.");

            this.timerIO = setInterval(() => {
                if (this.droppingIO) {
                    if (stateIO >= 3) {
                        stateIO = 0;

                        // Disable last Droplet.
                        this.setDropplet(3, false);
                    } else {
                        // Disable last Droplet.
                        this.setDropplet(stateIO, false);

                        // Increment Droplet.
                        stateIO++;

                        // Enable next Droplet.
                        this.setDropplet(stateIO, true);
                    }
                }
            }, 1000);
        }
    }

    private handleFlow(valueIO: string) {
        if (valueIO != undefined && valueIO != null) {
            const integerIO = Number(valueIO);

            // If Wattage Usage is bigger than 10Watts.
            if (integerIO > 10) {
                this.droppingIO = true;
            } else {
                this.droppingIO = false;

                // Disable all current Droplets.
                this.setDropplet(1, false);
                this.setDropplet(2, false);
                this.setDropplet(3, false);
            }
        }
    }

    private setDropplet(idIO: number, stateIO: boolean) {
        const dropletIO = this.querySelector("#droplet-" + idIO);

        if (dropletIO != undefined && dropletIO != null) { // @ts-ignore
            dropletIO.style.visibility = (stateIO ? "visible" : "hidden");
        }
    }

    private setImageState(stateIO: boolean, imageIO: HTMLImageElement) {
        if (!imageIO.hasAttribute("state"))
            imageIO.setAttribute("state", "false");

        const attributeIO: boolean = (imageIO.getAttribute("state") == "true");

        if (stateIO && !attributeIO) {
            imageIO.src = flashOn;
            imageIO.setAttribute("state", "true")
        } else if (!stateIO && attributeIO) {
            imageIO.src = flashOff;
            imageIO.setAttribute("state", "false");
        }
    }
}

// Configure the preview in the Lovelace card picker
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).customCards = (window as any).customCards || [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).customCards.push({
    type: 'hass-wasserwerk-card',
    name: 'Wasserwerk',
    preview: true,
    description: 'A water meter with display of quantities of liquid that have already flowed through. Animated cogs indicate a change in the values.',
});