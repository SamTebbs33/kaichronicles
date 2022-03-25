import { App, DebugMode } from "../app";
import { Book } from "../model/book";
import { BookValidator } from "../model/bookValidator";
import { Section } from "../model/section";
import { routing } from "../routing";
import { state } from "../state";
import { template } from "../template";
import { views } from "../views";
import { gameView } from "../views/gameView";
import { Controller } from "./controllerFactory";
import { mechanicsEngine } from "./mechanics/mechanicsEngine";
import { setupController } from "./setupController";

/**
 * The game controller
 */
export class gameController implements Controller {

    private static instance: gameController;

    private constructor() {
        // Set constructor private
    }

    public static getInstance(): gameController {
        if(!this.instance) {
            this.instance = new this()
        }
        return this.instance;
    }

    /**
     * The current book section
     */
    currentSection: Section = null;

    /**
     * Setup the game view
     */
    async index() {
        if (!setupController.getInstance().checkBook()) {
            return;
        }

        if (state.sectionStates.currentSection === Book.KAIMONASTERY_SECTION) {
            this.gameTemplateSetup();
            // Special case: Move to the inexistent section for the Kai monastery
            routing.redirect("kaimonastery");
            return;
        }

        await views.loadView("game.html");
        this.gameTemplateSetup();
        gameView.setup();
        // Go to the current section (or the initial)
        let sec = state.sectionStates.currentSection;
        if (!sec) {
            sec = Book.INITIAL_SECTION;
        }
        this.loadSection(sec, false, state.actionChart.yScrollPosition);
    }

    /** Setup the HTML main page template for the game view */
    gameTemplateSetup() {
        template.showStatistics(true);
        template.setNavTitle(state.book.getBookTitle(), "#game", false);
    }

    /**
     * Load and display a section
     * @param sectionId The section id to display
     * @param choiceLinkClicked True if the section is load due to a choice link click
     * @param yScroll y coord. where to scroll initially
     */
    loadSection(sectionId: string, choiceLinkClicked = false, yScroll = 0) {
        // Load and display the section
        const newSection = new Section(state.book, sectionId, state.mechanics);
        if (!newSection.exists()) {
            mechanicsEngine.debugWarning("Section " + sectionId + " does not exists");
            return;
        }
        this.currentSection = newSection;

        // Clear previous section toasts:
        toastr.clear();

        // Fire choice events:
        if (choiceLinkClicked) {
            mechanicsEngine.fireChoiceSelected(sectionId);
        }

        // Store the current section id (must to be done BEFORE execute mechanicsEngine.run,
        // there are references to this there)
        state.sectionStates.currentSection = sectionId;

        // Show the section
        gameView.setSectionContent(this.currentSection);

        // Update previous / next navigation links
        gameView.updateNavigation(this.currentSection);

        // Run section mechanics
        mechanicsEngine.run(this.currentSection);

        // Bind choice links
        gameView.bindChoiceLinks();

        // Scroll to top (or to the indicated place)
        if (!yScroll) {
            yScroll = 0;
        }
        window.scrollTo(0, yScroll);

        // Persist state
        state.persistState();

        if (App.debugMode === DebugMode.DEBUG) {
            // Show section that can come to here
            gameView.showOriginSections();
        }

        if (App.debugMode === DebugMode.DEBUG || App.debugMode === DebugMode.TEST) {
            // Validate this section
            const validator = new BookValidator(state.mechanics, state.book);
            validator.validateSection(this.currentSection.sectionId);
            for (const error of validator.errors) {
                mechanicsEngine.debugWarning(error);
            }

            template.addSectionReadyMarker();
        }
    }

    /**
     * Navigate to the previous or next section
     * @param increment -1 to go the previous. +1 to the next
     */
    onNavigatePrevNext(increment: number) {
        const s = this.currentSection;
        const newId = (increment < 0 ? s.getPreviousSectionId() : s.getNextSectionId());
        if (newId) {
            this.loadSection(newId);
        } else {
            mechanicsEngine.debugWarning("No previous/next section found");
        }
    }

    /** Return page */
    getBackController() {
        return "mainMenu";
    }

    /**
     * On leave controller
     */
    onLeave() {
        if (!state || !state.actionChart) {
            return;
        }

        // Store the scroll position.
        // Special case: Do not store if we are going redirected from 'game' controller, at the index function to 'kaimonastery'
        if (!(routing.getControllerName() === "kaimonasteryController" && window.pageYOffset === 0)) {
            state.actionChart.yScrollPosition = window.pageYOffset;
        }

        state.persistState();
    }

}
