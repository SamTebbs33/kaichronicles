import { loadGameController } from "../controller/loadGameController";
import { mechanicsEngine } from "../controller/mechanics/mechanicsEngine";

/**
 * The load game view interface functions
 */
export const loadGameView = {

    /**
     * Hide the web file uploader
     */
    hideFileUpload() { $("#loadGame-file").hide(); },

    /**
     * Bind web file uploader events
     */
    bindFileUploaderEvents() {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        (<JQuery<HTMLInputElement>> $("#loadGame-file")).on("change", function() {
            if (!this.files || !this.files[0]) {
                return;
            }
            loadGameController.getInstance().fileUploaderChanged(this.files[0]);
        });
    },

    /**
     * Show an error
     * @param errorMsg Message to show
     */
    showError(errorMsg: string) {
        $("#loadGame-errors").text(errorMsg);
        mechanicsEngine.debugWarning(errorMsg);
    }
};
