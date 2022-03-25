import { AboutController } from "./aboutController"
import { actionChartController } from "./actionChartController";
import { faqController } from "./faqController";
import { gameController } from "./gameController";
import { gameRulesController } from "./gameRulesController";
import { kaimonasteryController } from "./kaimonasteryController";
import { loadGameController } from "./loadGameController";
import { mainMenuController } from "./mainMenuController";
import { mapController } from "./mapController";
import { newGameController } from "./newGameController";
import { privacyController } from "./privacyController";
import { projectAonLicenseController } from "./projectAonLicenseController";
import { settingsController } from "./settingsController";
import { setupController } from "./setupController";
import { testsController } from "./testsController";

export interface Controller {

    /**
     * Method called when rendering the controller.
     */
    index();

    /**
     * Method called when leaving the controller.
     */
    onLeave();
}

export class ControllerFactory {
    public static getController(name: string): Controller {
        switch (name) {
            case "aboutController":
                return AboutController.getInstance();
            case "actionChartController":
                return actionChartController.getInstance();
            case "faqController":
                return faqController.getInstance();
            case "gameController":
                return gameController.getInstance();
            case "gameRulesController":
                return gameRulesController.getInstance();
            case "kaimonasteryController":
                return kaimonasteryController.getInstance();
            case "loadGameController":
                return loadGameController.getInstance();
            case "mainMenuController":
                return mainMenuController.getInstance();
            case "mapController":
                return mapController.getInstance();
            case "newGameController":
                return newGameController.getInstance();
            case "privacyController":
                return privacyController.getInstance();
            case "projectAonLicenseController":
                return projectAonLicenseController.getInstance();
            case "settingsController":
                return settingsController.getInstance();
            case "setupController":
                return setupController.getInstance();
            case "testsController":
                return testsController.getInstance();
            default:
                return null;
        }
    }
}