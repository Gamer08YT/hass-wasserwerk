/**
 * Card Implementation.
 */
class wasserwerkCard extends HTMLElement {
    // Store last Value to change only when updated.
    valueIO = null;

    // Whenever the state changes, a new `hass` object is set. Use this to
    // update your content.
    set hass(hass) {
        // Initialize the content if it's not there yet.
        if (!this.content) {
            this.innerHTML = `
        <ha-card header="` + this.config.title + `">
         <div class="tank-container" style="display: flex; flex-direction: row; flex-wrap: nowrap; justify-content: center; align-content: center; align-items: center;">
            <div class="tank-inner" style="position: relative;">
                <img style="height: 15rem; width: auto; position: relative;" src="/local/images/tank.png" />
                <div class="tank-water" style="position: absolute; max-height: 55%; height: 20%; bottom: 10%; right: 6.7%; left: 15%; background-repeat: no-repeat; background-size: cover; background-image: url(/local/images/water.jpg);">
            </div>
         </div>
        </ha-card`;

            // Update Content Var.
            this.content = this.querySelector("div");
        }

        const entityId = this.config.entity;
        const state = hass.states[entityId];
        const stateStr = state ? state.state : "unavailable";


        // Update Content if Value has changed.
        if (this.valueIO !== stateStr) {
            // Update Height of Image.
            this.getImageElement().style.height = (Number.parseInt(this.calcLevel(stateStr)) + "px");

            // Update cached Value.
            this.valueIO = stateStr;
        }

        // Set Value if not null.
        if (this.valueIO == null)
            this.valueIO = stateStr;
    }

    /**
     * Get Fluid Image Element.
     */
    getImageElement() {
        return this.getElementsByTagName("ha-card")[0].getElementsByClassName("tank-container")[0].getElementsByClassName("tank-inner")[0].getElementsByClassName("tank-water")[0];
    }

    // The user supplied configuration. Throw an exception and Home Assistant
    // will render an error card.
    setConfig(config) {
        if (!config.entity) {
            throw new Error("You need to define an entity");
        }

        if (!config.volume) {
            throw  new Error("You need to define the max Volume of your Tank.");
        }

        this.config = config;
    }

    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns.
    getCardSize() {
        return 3;
    }

    /**
     * Calculate Level with Max Size of Tank.
     * @param measureIO
     * @returns {number}
     */
    calcLevel(measureIO) {
        const maxIO = (this.config.volume);

        return Number.parseInt(measureIO) / (maxIO / 100);
    }

    static getConfigElement() {
        const elementIO = document.createElement("hass-wasserwerk-editor");

        elementIO.innerHTML = "<div>Currently not supported, please use YAML Editor.<br><br>" +
            "<code style='background-color: gray'>type: custom:hass-wasserwerk-card<br>" +
            "entity: sensor...<br>" +
            "volume: 100<br>" +
            "title: Tank</code></div>";

        return elementIO;
    }

    static getStubConfig() {
        return {
            entity: "",
            volume: 1000,
            title: "Tank Level"
        }
    }

}

// Define Card Class.
customElements.define("hass-wasserwerk-card", wasserwerkCard);


/**
 * Graphical Card Configuration.
 */
class wasserwerkCardConfig extends HTMLElement {
    setConfig(config) {
        this._config = config;
    }

    configChanged(newConfig) {
        const event = new Event("config-changed", {
            bubbles: true,
            composed: true,
        });
        event.detail = {config: newConfig};
        this.dispatchEvent(event);
    }
}

// Define Configuration Class.
customElements.define("hass-wasserwerk-editor", wasserwerkCardConfig);
window.customCards = window.customCards || [];
window.customCards.push({
    type: "hass-wasserwerk-card",
    name: "Tank Level Card",
    preview: false, // Optional - defaults to false
    description: "This card shows the current fluid level in a tank or cistern, as well as the percentage of capacity and the volume of fluid.", // Optional
});

function loadCSS(url) {
    const link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
}

loadCSS("/local/hass-wasserwerk-card.css");