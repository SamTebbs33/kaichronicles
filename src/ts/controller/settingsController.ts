import { Color, state } from "../state";
import { template } from "../template";
import { views } from "../views";
import { settingsView } from "../views/settingsView";
import { translations } from "../views/viewsUtils/translations";
import { mechanicsEngine } from "./mechanics/mechanicsEngine";
import { setupController } from "./setupController";
import { saveAs } from 'file-saver';
import { Controller } from "./controllerFactory";

/**
 * Game settings controller
 */
export class settingsController implements Controller {

    private static instance: settingsController;

    private constructor() {
        // Set constructor private
    }

    onLeave() {
        // Do Nothing
    }

    public static getInstance(): settingsController {
        if(!this.instance) {
            this.instance = new this()
        }
        return this.instance;
    }

    async index() {
        if ( !setupController.getInstance().checkBook() ) {
            return;
        }

        document.title = translations.text("settings");

        await views.loadView("settings.html");
        settingsView.setup();
    }

    /**
     * Change the current color theme
     * @param color 'light' or 'dark'
     */
    changeColorTheme(color: Color): void {
        template.changeColorTheme( color );
        state.updateColorTheme( color );
    }

    /**
     * Show the save game dialog
     */
    saveGameDialog() {
        $("#settings-saveDialog").modal("show");
    }

    /** Return a string to put on saved games files */
    getDateForFileNames(): string {
        const now = new Date();
        return now.getFullYear().toString() + "_" +
            ( now.getMonth() + 1 ).toString().padStart( 2 , "0" ) + "_" +
            now.getDate().toString().padStart( 2 , "0" ) + "_" +
            now.getHours().toString().padStart( 2 , "0" ) + "_" +
            now.getMinutes().toString().padStart( 2 , "0" ) + "_" +
            now.getSeconds().toString().padStart( 2 , "0" );
    }

    /**
     * Return a default save game file name
     */
    defaultSaveGameName() {
        return this.getDateForFileNames() + "-book-" + state.book.bookNumber.toString() + "-savegame.json";
    }

    /**
     * Save the current game
     * @param fileName File name to save
     */
    saveGame(fileName: string) {
        try {
            const stateJson = state.getSaveGameJson();
            const blob = new Blob( [ stateJson ], {type: "text/plain;charset=utf-8"});

            // Check file name
            fileName = fileName.trim();
            if ( !fileName ) {
                fileName = this.defaultSaveGameName();
            }
            if ( !fileName.toLowerCase().endsWith(".json") ) {
                fileName += ".json";
            }

            // Check for invalid character names
            if ( !fileName.isValidFileName() ) {
                alert("The file name contains invalid characters");
                return false;
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            saveAs(blob, fileName);
            return true;
        } catch (e) {
            mechanicsEngine.debugWarning(e);
            alert("Your browser version does not support save file with javascript. " +
                "Try a newer browser version. Error: " + e);
            return false;
        }
    }

    /** Return page */
    getBackController() { return "game"; }

}
