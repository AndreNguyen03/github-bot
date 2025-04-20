"use strict";
module.exports = (app) => {
    app.on("issues.opened", async (context) => {
        app.log.info("Hello! Issue opened!");
    });
};
