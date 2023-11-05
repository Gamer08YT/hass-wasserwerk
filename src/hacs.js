// Configure the preview in the Lovelace card picker
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window).customCards = (window).customCards || [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window).customCards.push({
    type: 'hass-wasserwerk-card',
    name: 'Wasserwerk',
    preview: true,
    description: 'A water meter with display of quantities of liquid that have already flowed through. Animated cogs indicate a change in the values.',
});