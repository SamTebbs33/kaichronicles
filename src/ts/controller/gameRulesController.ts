import { Book } from "../model/book";
import { BookSeriesId } from "../model/bookSeries";
import { Section } from "../model/section";
import { SectionRenderer } from "../model/sectionRenderer";
import { routing } from "../routing";
import { state } from "../state";
import { views } from "../views";
import { gameView } from "../views/gameView";
import { translations } from "../views/viewsUtils/translations";
import { Controller } from "./controllerFactory";
import { mechanicsEngine } from "./mechanics/mechanicsEngine";
import { setupController } from "./setupController";

/**
 * Game rules controller
 */
export class gameRulesController implements Controller {

    private static instance: gameRulesController;

    private constructor() {
        // Set constructor private
    }

    onLeave() {
        // Do Nothing
    }

    public static getInstance(): gameRulesController {
        if(!this.instance) {
            this.instance = new this()
        }
        return this.instance;
    }

    /**
     * Render the game rules page
     */
    async index() {
        if (!setupController.getInstance().checkBook()) {
            return;
        }

        document.title = translations.text("gameRules");
        await views.loadView("gameRules.html")
        // Push game rules sections:
        this.appendSection(Book.COMBATRULESSUMMARY_SECTION);
        this.appendSection(Book.KAILEVELS_SECTION);

        if (state.book.getBookSeries().id === BookSeriesId.Magnakai) {
            // Lore-circles rules
            this.appendSection(Book.LORECIRCLES_SECTION);
            // Improved disciplines
            this.appendSection(Book.IMPROVEDDISCIPLINES_SECTION);
        }

        this.appendSection(Book.HOWTOCARRY_SECTION);
        this.appendSection(Book.HOWTOUSE_SECTION);

        // Bind combat table links
        gameView.bindCombatTablesLinks();

        // If a section parameter was specified, scroll to that section
        try {
            const section: string = routing.getHashParameter("section");
            if (section) {
                window.scrollTo(0, $("a[id=" + section + "]").offset().top - 65);
            }
        } catch (e) {
            mechanicsEngine.debugWarning(e);
        }
    }

    appendSection(sectionId: string) {
        const section = new Section(state.book, sectionId, state.mechanics);
        const renderer = new SectionRenderer(section);

        // Add a target anchor
        let html = '<a id="' + sectionId + '"></a>';
        html += "<h2>" + section.getTitleHtml() + "</h2>";
        html += renderer.renderSection();

        $("#rules-content").append(html);
    }

    /** Return page (the caller) */
    getBackController() { return null; }

}
