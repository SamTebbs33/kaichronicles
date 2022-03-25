import { routing } from "../routing";
import { state } from "../state";
import { template } from "../template";
import { views } from "../views";
import { setupView } from "../views/setupView";
import { Controller } from "./controllerFactory";
import { mechanicsEngine } from "./mechanics/mechanicsEngine";

/**
 * The book loader controller
 * TODO: Change the name of this controller. It's a "book setup" controller
 */
export class setupController implements Controller {

    private static instance: setupController;

    private constructor() {
        // Set constructor private
    }

    onLeave() {
        // Do Nothing
    }

    public static getInstance(): setupController {
        if(!this.instance) {
            this.instance = new this()
        }
        return this.instance;
    }

    /** Set up the application
     * This will load the XML book and then redirect to the game
     */
    index() {

        // If the book is already loaded, redirect to the game
        if (state.book && state.book.bookXml) {
            console.log("Book already loaded");
            template.setNavTitle(state.book.getBookTitle(), "#game", false);
            routing.redirect("game");
            return;
        }

        // Check if there is a persisted state
        if (state.existsPersistedState()) {
            // At this moment the mechanics/object XML is unknown, and this log errors on the console:
            // template.updateStatistics(true);
            state.restoreState();            
        } else {
            // New game. Get hash URL parameters
            const bookNumber = parseInt(routing.getHashParameter("bookNumber"), 10);
            const keepActionChart = routing.getHashParameter("keepActionChart") === "true";
            state.setup(bookNumber, keepActionChart);
        }
        template.translateMainMenu();

        void views.loadView("setup.html");
        void this.runDownloads();
    }

    async runDownloads() {
        setupView.log(state.book.getBookXmlURL() + " download started...");
        await state.book.downloadBookXml();
        setupView.log(state.book.getBookXmlURL() + " OK!", "ok");
        
        setupView.log(state.mechanics.getXmlURL() + " download started...");
        await state.mechanics.downloadXml();
        setupView.log(state.mechanics.getXmlURL() + " OK!", "ok");
        
        setupView.log(state.mechanics.getObjectsXmlURL() + " download started...");
        await state.mechanics.downloadObjectsXml();
        setupView.log(state.mechanics.getObjectsXmlURL() + " OK!", "ok");
        
        setupView.log(mechanicsEngine.mechanicsUIURL + " download started...");
        await mechanicsEngine.downloadMechanicsUI();
        setupView.log(mechanicsEngine.mechanicsUIURL + " OK!", "ok");

        setupView.log("Done!");
        setupView.done();

        // Fill the random table UI
        template.fillRandomTableModal(state.book.bookRandomTable);
        template.setNavTitle(state.book.getBookTitle(), "#game", false);
        template.updateStatistics(true);
        routing.redirect("game");
    }

    restartBook() {
        const bookNumber = state.book.bookNumber;
        state.reset(false);
        template.updateStatistics(true);
        routing.redirect("setup", {
            bookNumber,
            keepActionChart: true
        });
    }

    /**
     * Check if the book is already loaded.
     * If is not, it redirects to the main menu
     * @return false if the book is not loaded
     */
    checkBook() {
        if (!state.book) {
            // The book was not loaded
            console.log("Book not loaded yet");
            routing.redirect("mainMenu");
            return false;
        }
        return true;
    }

    /** Return page */
    getBackController() { return "mainMenu"; }

}
