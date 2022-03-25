import { actionChartController } from "../../controller/actionChartController";
import { mechanicsEngine } from "../../controller/mechanics/mechanicsEngine";
import { Item } from "../../model/item";
import { state } from "../../state";
import { translations } from "./translations";

/**
 * Modal dialog to pick / drop money.
 */
export class MoneyDialog {

    public static show(drop: boolean) {

        MoneyDialog.setupDialog();

        // Update bounds and initial value
        if (drop) {
            $("#mechanics-moneyamount")
                .attr("max", state.actionChart.beltPouch)
                .val("1");
            $("#mechanics-moneyamount").attr("data-ismoneypicker", "true");
        } else {
            const sectionMoney = state.sectionStates.getSectionState().getAvailableMoney();
            $("#mechanics-moneyamount")
                .attr("max", sectionMoney)
                .val(sectionMoney);
            $("#mechanics-moneyamount").attr("data-ismoneypicker", "false");
        }

        const $dlg = $("#mechanics-moneydialog");

        // Update translations
        const title = (drop ? "dropMoney" : "pickMoney");
        $("#mechanics-moneytitle").attr("data-translation", title);
        $("#mechanics-moneyapply").attr("data-translation", title);
        translations.translateTags($dlg);

        // Show
        $dlg
            .prop("data-isdrop", drop)
            .modal("show");
    }

    private static setupDialog() {

        // If the dialog HTML do not exists, add it:
        if ($("#mechanics-moneydialog").length > 0) {
            return;
        }

        const $moneyDlg = mechanicsEngine.getMechanicsUI("mechanics-moneydialog");
        $("body").append($moneyDlg);

        // Bind money picker events
        $("#mechanics-moneyamount").bindNumberEvents();

        // Bind drop money confirmation button
        $("#mechanics-moneyapply").on("click", (e: JQuery.TriggeredEvent) => {
            e.preventDefault();
            MoneyDialog.onDialogConfirmed();
        });

    }

    private static onDialogConfirmed() {

        const $moneyAmount = $("#mechanics-moneyamount");
        if (!$moneyAmount.isValid()) {
            return;
        }

        const moneyAmount = $moneyAmount.getNumber();
        if ($("#mechanics-moneydialog").prop("data-isdrop")) {
            // Drop
            actionChartController.getInstance().increaseMoney(- moneyAmount, true);
        } else {
            // Pick
            const countPicked = actionChartController.getInstance().increaseMoney(moneyAmount);
            const sectionState = state.sectionStates.getSectionState();
            sectionState.removeObjectFromSection(Item.MONEY, 0, countPicked);
            // Re-render section
            mechanicsEngine.showAvailableObjects();
        }
        $("#mechanics-moneydialog").modal("hide");
    }
}
