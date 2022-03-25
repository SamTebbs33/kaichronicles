
import { BookValidator } from "../model/bookValidator";
import { projectAon } from "../model/projectAon";
import { randomTable } from "../model/randomTable";
import { Section } from "../model/section";
import { SectionRenderer } from "../model/sectionRenderer";
import { state } from "../state";
import { views } from "../views";
import { Controller } from "./controllerFactory";
import { mechanicsEngine } from "./mechanics/mechanicsEngine";
import { setupController } from "./setupController";

/**
 * Application tests
 */

// tslint:disable-next-line: class-name
export class testsController implements Controller {

    private static instance: testsController;

    private constructor() {
        // Set constructor private
    }

    onLeave() {
        // Do Nothing
    }

    public static getInstance(): testsController {
        if(!this.instance) {
            this.instance = new this()
        }
        return this.instance;
    }

    public async index() {

        await views.loadView("tests.html");
        await BookValidator.downloadXsd();
        this.setup();
    }

    /**
     * Setup view
     */
    private setup() {
        $("#tests-random").on("click", (e: JQuery.Event) => {
            e.preventDefault();
            this.testRandomTable();
        });
        $("#tests-rendering").on("click", (e: JQuery.Event) => {
            e.preventDefault();
            this.testRendering();
        });
        $("#tests-bookmechanics").on("click", (e: JQuery.Event) => {
            e.preventDefault();
            this.testCurrentBookMechanics();
        });
        $("#tests-allbooks").on("click", (e: JQuery.Event) => {
            e.preventDefault();
            void this.testAllBooks();
        });

    }

    /**
     * Test new tags with no render function
     */
    private testRendering() {

        this.clearLog();

        if (!setupController.getInstance().checkBook()) {
            this.addError("No book loaded yet (Finished");
            return;
        }

        const count = state.mechanics.getSectionsCount();
        this.addLog("Testing sections render (" + count.toString() + ")");
        for (let i = 1; i < count; i++) {
            try {
                const section = new Section(state.book, "sect" + i.toString(), state.mechanics);
                const renderer = new SectionRenderer(section);
                renderer.renderSection();
            } catch (e) {
                this.addError("Section " + i.toString() + " error: " + e, e);
            }
        }
        this.addLog("Finished (errors are displayed here, see Dev. Tools console for warnings)");
    }

    /**
     * Test random table ramdomness
     */
    private testRandomTable() {

        this.clearLog();

        if (!setupController.getInstance().checkBook()) {
            this.addError("No book loaded yet (Finished)");
            return;
        }

        // Test implemented random table
        let count = new Array<number>();
        for (let i = 0; i < 10; i++) {
            count[i] = 0;
        }
        const total = 1000000;
        for (let i = 0; i < total; i++) {
            count[randomTable.getRandomValue()]++;
        }
        console.log("Randomness test (" + total.toString() + " random table hits)");
        for (let i = 0; i < 10; i++) {
            this.addLog(i.toString() + ": " + count[i].toString() + " hits (" + ((count[i] / total) * 100.0).toString() + " %)");
        }

        // Test randomness of the book random table:
        count = [];
        for (let i = 0; i < 10; i++) {
            count[i] = 0;
        }
        const bookRandomTable = state.book.getRandomTable();
        for (const num of bookRandomTable) {
            count[num]++;
        }

        console.log("Book random table:");
        for (let i = 0; i < 10; i++) {
            this.addLog(i.toString() + ": " + count[i].toString() + " (" + ((count[i] / bookRandomTable.length) * 100.0).toString() + " %)");
        }
    }

    private testCurrentBookMechanics() {
        this.clearLog();
        const validator = new BookValidator(state.mechanics, state.book);
        this.testBook(validator);
        this.addLog("Finished");
    }

    private testBook( validator: BookValidator ) {
        validator.validateBook();
        const title = "Book " + validator.book.bookNumber.toString();
        if (validator.errors.length === 0) {
            this.addLog(title + "OK!");
        } else {
            this.addLog(title + "with errors:");
        }
        for (const error of validator.errors) {
            this.addError(error);
        }

        // Separator
        this.addLog("");
    }

    private async downloadAndTestBook( bookNumber: number ) {

        const validator = await BookValidator.downloadBookAndGetValidator(bookNumber)

        this.testBook(validator);

        // Move to the next book:
        const nextBookNumber = validator.book.bookNumber + 1;
        if (nextBookNumber > projectAon.supportedBooks.length) {
            this.addLog("Finished");
            return;
        }

        await this.downloadAndTestBook(nextBookNumber);
    }

    private async testAllBooks() {
        this.clearLog();
        await this.downloadAndTestBook(1);
    }

    private clearLog() {
        $("#tests-log").empty();
    }

    private addLog( textLine: string ) {
        $("#tests-log").append(textLine + "</br>");
    }

    private addError( textLine: string , exception = null ) {
        this.addLog("ERROR: " + textLine);
        if (exception) {
            mechanicsEngine.debugWarning(exception);
        }
    }

    /** Return page */
    public getBackController(): string { return "game"; }

}
