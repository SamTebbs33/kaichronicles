
/**
 * Load stored game controller
 */

import { routing } from "../routing";
import { state } from "../state";
import { template } from "../template";
import { views } from "../views";
import { loadGameView } from "../views/loadGameView";
import { translations } from "../views/viewsUtils/translations";
import { Controller } from "./controllerFactory";
import { mechanicsEngine } from "./mechanics/mechanicsEngine";

// tslint:disable-next-line: class-name
export class loadGameController implements Controller {

    private static instance: loadGameController;

    private constructor() {
        // Set constructor private
    }

    onLeave() {
        // Do Nothing
    }

    public static getInstance(): loadGameController {
        if (!this.instance) {
            this.instance = new this()
        }
        return this.instance;
    }

    /**
     * The load game page
     */
    public async index() {
        template.setNavTitle(translations.text("kaiChronicles"), "#mainMenu", true);
        template.showStatistics(false);
        await views.loadView("loadGame.html");
        loadGameView.bindFileUploaderEvents();
    }

    /**
     * Called when the selected file changes (only web)
     * @param fileToUpload The selected file
     */
    public fileUploaderChanged(fileToUpload: Blob) {
        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.loadGame(<string>e.target.result);
            };
            reader.readAsText(fileToUpload);
        } catch (e) {
            mechanicsEngine.debugWarning(e);
            loadGameView.showError(e.toString());
        }
    }

    /**
     * Load saved game and start to play it
     * @param jsonState The saved game file content
     */
    private loadGame(jsonState: string) {
        try {
            state.loadSaveGameJson(jsonState);
            routing.redirect("setup");
        } catch (e) {
            mechanicsEngine.debugWarning(e);
            loadGameView.showError(e.toString());
        }
    }

    /** Return page */
    public getBackController() { return "mainMenu"; }

}
