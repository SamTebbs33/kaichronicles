import { state, Color } from "../state";
import { template } from "../template";
import { views } from "../views";
import { mainMenuView } from "../views/mainMenuView";
import { translations } from "../views/viewsUtils/translations";
import { Controller } from "./controllerFactory";
import { settingsController } from "./settingsController";

/**
 * The application menu controller
 */
export class mainMenuController implements Controller {

    private static instance: mainMenuController;

    private constructor() {
        // Set constructor private
    }

    onLeave() {
        // Do Nothing
    }

    public static getInstance(): mainMenuController {
        if(!this.instance) {
            this.instance = new this()
        }
        return this.instance;
    }

    /**
     * The game menu
     */
    async index() {
        template.setNavTitle( translations.text("kaiChronicles") , "#mainMenu", true);
        template.showStatistics(false);
        await views.loadView("mainMenu.html")
        mainMenuView.setup();

        // Check if there is a current game
        if ( !state.existsPersistedState() ) {
            mainMenuView.hideContinueGame();
        }
    }

    /**
     * Change the current color theme
     */
    async changeColor() {
        settingsController.getInstance().changeColorTheme(state.color === Color.Light ? Color.Dark : Color.Light);
        await this.index();
    }

    /** Return page */
    getBackController() { return "exitApp"; }

}
