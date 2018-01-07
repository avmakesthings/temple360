// TODO: Rename 'app' to 'appState' or 'state' in app.js
// Move that reducer, the window events, & this helper to the same file
// Import & use this helper wherever appState needs to be pulled
// Require the rest into app.js - condense with the one in ui_markers

module.exports = function getState(key) {
    var sceneEl = document.querySelector("a-scene");
    var appState = sceneEl.systems.state.state.app;
    return appState[key];
};
