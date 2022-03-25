import { Book } from "../model/book";
import { Section } from "../model/section";
import { SectionRenderer } from "../model/sectionRenderer";
import { state } from "../state";
import { views } from "../views";
import { translations } from "../views/viewsUtils/translations";
import { Controller } from "./controllerFactory";
import { setupController } from "./setupController";

/**
 * About the book controller
 */
export class AboutController implements Controller {

    private static instance: AboutController;

    private constructor() {
        // Set constructor private
    }

    onLeave() {
        // Do Nothing
    }

    public static getInstance(): AboutController {
        if (!this.instance) {
            this.instance = new this()
        }
        return this.instance;
    }

    /**
     * Render the about page
     */
    async index() {

        if (!setupController.getInstance().checkBook()) {
            return;
        }

        document.title = translations.text("about");
        await views.loadView("about.html");

        // Get all metadata about the book:
        $("#about-title").text(state.book.getBookTitle());
        $("#about-copyright").append(state.book.getCopyrightHtml());
        this.appendSection("dedicate", "#about-dedication");
        this.appendSection("acknwldg", "#about-content");
        $("#about-cover").attr("src", state.book.getCoverURL());

        // Download and show authors info, if it's available (only from v 1.8 generated zip book files)
        try {
            const promises = await state.book.downloadAuthorsBio();
            // Wait downloads and the HTML of each one
            for (let xml of promises) {
                xml = Book.fixXml(xml);
                xml = "<div><p>" + xml + "</p></div>";
                this.authorInfoDownloaded(xml);
            }
        } catch (ex) {
            mechanicsEngine.debugWarning(ex);
        }
    }

    /**
     * Append an author biography to the about page
     * @param authorInfoXml The author biography XML
     */
    authorInfoDownloaded(authorInfoXml: string) {

        // Show the about authors title
        const $authorsWrapper = $("#about-authors-wrapper");
        $authorsWrapper.show();

        // Append the author biography
        const fakeSection = Section.createFromXml(state.book, $(authorInfoXml));
        const renderer = new SectionRenderer(fakeSection);
        $authorsWrapper.append(renderer.renderSection());
    }

    appendSection(sectionId: string, containerId: string) {
        const section = new Section(state.book, sectionId, state.mechanics);
        const renderer = new SectionRenderer(section);
        $(containerId).append(renderer.renderSection());
    }

    /** Return page */
    getBackController(): string { return "settings"; }

}
