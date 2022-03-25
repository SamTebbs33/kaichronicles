import { declareCommonHelpers } from "./common";
import { mechanicsEngine } from "./controller/mechanics/mechanicsEngine";
import { routing } from "./routing";
import { state } from "./state";
import { template } from "./template";
import { views } from "./views";

/** Execution enviroment type */
export enum EnvironmentType {
    Development = "DEVELOPMENT",
    Production = "PRODUCTION"
}

/** Debug execution mode */
export enum DebugMode {
    NO_DEBUG = 0,
    DEBUG = 1,
    TEST = 2
}

export * from "./controller/mainMenuController";
export * from "./controller/privacyController";
export * from "./controller/testsController";
export * from "./controller/gameController";
export * from "./controller/loadGameController";
export * from "./controller/actionChartController";
export * from "./controller/aboutController";
export * from "./controller/faqController";
export * from "./controller/mapController";
export * from "./controller/projectAonLicenseController";
export * from "./controller/setupController";
export * from "./controller/newGameController";
export * from "./controller/settingsController";
export * from "./controller/kaimonasteryController";
export * from "./controller/gameRulesController";

/**
 * The web application
 */
export class App {

    /** The webpack library name */
    public static readonly PACKAGE_NAME = "kai";

    /** Execution environment type */
    public static environment: EnvironmentType;

    /** Debug functions are enabled? */
    public static debugMode: DebugMode;

    /** Web application setup  */
    public static async run(environment: string) {

        // Declare helper functions in common.ts
        declareCommonHelpers();

        App.environment = environment as EnvironmentType;

        const urlParams = new URLSearchParams(window.location.search)
        // Are we in debug / test mode?
        if (urlParams.get("test") === "true") {
            App.debugMode = DebugMode.TEST;
            // To avoid Selenium clicks blocked by navbar
            template.fixedNavbarTop();
        } else if (urlParams.get("debug") === "true") {
            App.debugMode = DebugMode.DEBUG;
        } else {
            App.debugMode = DebugMode.NO_DEBUG;
        }

        if (App.debugMode !== DebugMode.NO_DEBUG) {
            // On debug mode, disable the cache (to always reload the books xml)
            console.log("Debug mode: cache disabled");
            $.ajaxSetup({ cache: false });
        }

        // Configure toast messages
        toastr.options.positionClass = "toast-position-lw";
        toastr.options.onclick = () => {
            // Remove all toasts on click one
            toastr.clear();
        };

        // First, load the views
        try {
            await views.setup();

            //try {
            console.log("Real setup started");

            // Then do the real application setup
            state.setupDefaultColorTheme();
            template.setup();
            routing.setup();

            if (App.debugMode === DebugMode.DEBUG && state.existsPersistedState()) {
                // If we are developing a book, avoid to press the "Continue game"
                routing.redirect("setup");
            }

        } catch (e) {
            // d'oh!
            mechanicsEngine.debugWarning(e);
            return jQuery.Deferred().reject(e).promise();
        }
        /*} catch (reason) {
            // TODO
            if (!reason) {
                template.setErrorMessage("Unknown error");
            }
            template.setErrorMessage(reason.toString());
        }*/
    }
}
