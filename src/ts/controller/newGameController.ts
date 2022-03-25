import { Book } from "../model/book";
import { routing } from "../routing";
import { state } from "../state";
import { template } from "../template";
import { views } from "../views";
import { newGameView } from "../views/newGameView";
import { translations } from "../views/viewsUtils/translations";
import { Controller } from "./controllerFactory";

/**
 * New game controller
 */
export class newGameController implements Controller {

    private static instance: newGameController;

    private constructor() {
        // Set constructor private
    }

    onLeave() {
        // Do Nothing
    }

    public static getInstance(): newGameController {
        if(!this.instance) {
            this.instance = new this()
        }
        return this.instance;
    }

    /**
     * New game page
     */
    async index() {
        // Get available books
        template.setNavTitle(translations.text("kaiChronicles"), "#mainMenu", true);
        template.showStatistics(false);

        state.manualRandomTable = state.actionChart && state.actionChart.manualRandomTable;

        await views.loadView("newGame.html");
        newGameView.setup();
    }

    /**
     * Start new game event
     * @param {string} bookNumber The book number
     */
    startNewGame(bookNumber: number) {
        state.reset(true);
        routing.redirect("setup", {
            bookNumber
        });
    }

    selectedBookChanged(newBookNumber: number) {
        const book = new Book(newBookNumber);
        newGameView.setCoverImage(book.getCoverURL());
    }

    /** Return page */
    getBackController() { return "mainMenu"; }

}
