import {HomeAssistant} from "custom-card-helpers";
import {customElement} from 'lit/decorators.js';

// @ts-ignore
import styles from "./hass-wasserwerk-card.scss";

// @ts-ignore
import templateIO from "../card.html";

// @ts-ignore
@customElement("hass-wasserwerk-card")
class HassWasserwerkCard extends HTMLElement {
    // Store Hass Instance.
    private hassIO: HomeAssistant;

    // Store Config Instance.
    protected configIO;

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
            this.innerHTML += templateIO;
        }

        // Parse Entity State.
        const arrayIO = this.configIO.pump;

        console.log("=====");
        console.log(arrayIO);
        console.log("=====");

        // Loop trough Entity Array.
        if (arrayIO instanceof Array) {
            for (const entityIO in arrayIO) {
                const stateIO = this.hassIO.states[entityIO];
                const valueIO = stateIO ? stateIO.state : "unavailable";

                console.log(valueIO);
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