import { mainMenuController } from "../controller/mainMenuController";
import { routing } from "../routing";
import { translations } from "./viewsUtils/translations";

export const mainMenuView = {

    /**
     * Main menu view
     */
    setup( ) {
        document.title = translations.text("kaiChronicles");

        $("#menu-continue").on("click", (e) => {
            e.preventDefault();
            routing.redirect("setup");
        });
        $("#menu-new").on("click", (e) => {
            e.preventDefault();
            routing.redirect("newGame");
        });
        $("#menu-load").on("click", (e) => {
            e.preventDefault();
            routing.redirect("loadGame");
        });
        $("#menu-color-theme").on("click", (e) => {
            e.preventDefault();
            void mainMenuController.getInstance().changeColor();
        });
        $("#menu-faq").on("click", (e) => {
            e.preventDefault();
            routing.redirect("faq");
        });
        $("#menu-privacy").on("click", (e) => {
            e.preventDefault();
            routing.redirect("privacy");
        });
    },

    /**
     * Hide web text info
     */
    hideWebInfo() {
        $("#menu-webinfo").hide();
    },

    /**
     * Hide the continue game button
     */
    hideContinueGame() {
        $("#menu-continue").hide();
    }

};
