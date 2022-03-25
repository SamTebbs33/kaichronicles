import { state } from "../state";
import { translations } from "../views/viewsUtils/translations";
import { Combat } from "./combat";
import { combatTable, COMBATTABLE_DEATH } from "./combatTable";
import { BookSeriesId } from "./bookSeries";

export class CombatTurn {

    /** True if the player is eluding the combat */
    public elude: boolean;

    /** Number of the turn (1 is the first) */
    public turnNumber: number;

    /** The random table result  */
    public randomValue: number;

    /** Lone wolf dammage multiplier (can have decimals) */
    public dammageMultiplier: number;

    /** Enemy dammage multiplier (can have decimals) */
    public enemyMultiplier: number;

    /** Enemy EP base loss.
     * It can be a number or COMBATTABLE_DEATH
     */
    public enemyBase: number;

    /** Enemy extra loss */
    public enemyExtra: number;

    /** The enemy total loss.
     * It can be a number or COMBATTABLE_DEATH
     */
    public enemy: number;

    /** The player base loss.
     * It can be a number or COMBATTABLE_DEATH
     */
    public loneWolfBase: number;

    /** Player extra loss */
    public loneWolfExtra: number;

    /** Player total loss.
     * It can be a number or COMBATTABLE_DEATH
     */
    public loneWolf: number;

    /** Text with the player loss */
    public playerLossText: string;

    /** Helshezag used on this turn? */
    public helshezagUsed = false;

    /**
     * Create a combat turn
     * TODO: Do not pass all those parameters. Pass only Combat, and read the properties
     * @param combat The combat owner of this turn
     * @param randomValue The random table value for this turn
     * @param elude True if the player is eluding the combat
     * @param helshezagUsed Helshezag used on this turn?
     */
    public constructor( combat: Combat , randomValue: number , elude: boolean , helshezagUsed: boolean ) {

        if ( !combat ) {
            // Default constructor (called on BookSectionStates.prototype.fromStateObject)
            return;
        }

        this.helshezagUsed = helshezagUsed;

        /** True if the player is eluding the combat */
        this.elude = elude;

        /** Number of the turn (1 is the first) */
        this.turnNumber = combat.turns.length + 1;

        /** The random table result  */
        this.randomValue = randomValue;
        /** Lone wolf dammage multiplier */
        this.dammageMultiplier = combat.dammageMultiplier;
        /** Enemy dammage multiplier */
        this.enemyMultiplier = combat.enemyMultiplier;

        const tableResult = combatTable.getCombatTableResult(combat.getCombatRatio(), this.randomValue);

        /** Enemy base loss  */
        this.enemyBase = ( ( elude || combat.enemyImmuneTurns >= this.turnNumber ) ? 0 : tableResult[0] );
        /** The enemy loss */
        this.enemy = CombatTurn.applyMultiplier( this.enemyBase , this.dammageMultiplier );
        /** Enemy extra loss (combat.enemyTurnLoss is negative) */
        this.enemyExtra = combat.enemyTurnLoss;
        if ( this.enemy !== COMBATTABLE_DEATH) {
            this.enemy -= combat.enemyTurnLoss;
        }
        /** Enemy loss due to Kai-blast */
        this.enemyExtra += combat.enemyKaiBlastLoss;
        if ( this.enemy !== COMBATTABLE_DEATH) {
            this.enemy -= combat.enemyKaiBlastLoss;
        }

        // Remove 1 Endurance if GrandMaster + Weaponmastery + Non-magical metal edged weapon
        if (state.book.bookNumber >= 16 && state.actionChart.isWeaponskillActive(combat.bowCombat, BookSeriesId.GrandMaster)
            && state.actionChart.getSelectedWeaponItem().grdWpnmstryBonus) { 
            this.enemyExtra += -1;
            if ( this.enemy !== COMBATTABLE_DEATH) {
                this.enemy -= -1;
            }
        }

        /** The player base loss */
        this.loneWolfBase = ( ( combat.immuneTurns >= this.turnNumber ) ? 0 : tableResult[1] );
        /** Player loss */
        this.loneWolf = CombatTurn.applyMultiplier( this.loneWolfBase , this.enemyMultiplier );

        // Player extra loss
        this.loneWolfExtra = 0;
        if ( this.loneWolf !== COMBATTABLE_DEATH && combat.mindforceEP < 0 && !state.actionChart.hasMindShield() ) {
            // Enemy mind force attack (combat.mindforceEP is negative):
            if ( this.loneWolf !== COMBATTABLE_DEATH) {
                this.loneWolf -= combat.mindforceEP;
            }
            this.loneWolfExtra = combat.mindforceEP;
        }
        if ( this.loneWolf !== COMBATTABLE_DEATH) {
            // Extra loss per turn
            this.loneWolf -= combat.turnLoss;
            // Extra loss if wounded on this turn
            if ( this.loneWolfBase !== 0 ) {
                this.loneWolf -= combat.turnLossIfWounded;
            }
        }
        this.loneWolfExtra += combat.turnLoss;
        if ( this.loneWolfBase !== 0 ) {
            this.loneWolfExtra += combat.turnLossIfWounded;
        }

        // Surge loss
        if ( combat.psiSurge ) {
            const psiSurgeLoss = Combat.surgeTurnLoss(combat.getSurgeDiscipline());
            if ( this.loneWolf !== COMBATTABLE_DEATH ) {
                this.loneWolf += psiSurgeLoss;
            }
            this.loneWolfExtra -= psiSurgeLoss;
        }

        // Kai-blast loss
        if ( combat.kaiBlast ) {
            if ( this.loneWolf !== COMBATTABLE_DEATH ) {
                this.loneWolf += 4;
            }
            this.loneWolfExtra -= 4;
        }

        /** Text with the player loss */
        this.playerLossText = this.calculatePlayerLossText();
    }

    /**
     * Return a text with the player loss
     */
    public getPlayerLossText(): string { return this.playerLossText; }

    /**
     * Calculate the text with the player loss
     */
    public calculatePlayerLossText(): string {
        return CombatTurn.lossText( this.loneWolfBase , this.enemyMultiplier , this.loneWolfExtra ,
            this.loneWolf );
    }

    /**
     * Return a text with the enemy loss
     */
    public getEnemyLossText(): string {
        return CombatTurn.lossText( this.enemyBase , this.dammageMultiplier , this.enemyExtra ,
            this.enemy );
    }

    /**
     * Translate the loss
     * @param {string|number} loss It can be a number with the loss, or COMBATTABLE_DEATH
     */
    public static translateLoss(loss: number): string {
        return loss === COMBATTABLE_DEATH ? translations.text( "deathLetter" ) : loss.toString();
    }

    /**
     * Get a text for a turn result
     */
    public static lossText( base: number , multiplier: number, extra: number, finalLoss: number ): string {
        let loss = CombatTurn.translateLoss( base );
        if ( multiplier !== 1 ) {
            loss = loss + " x " + multiplier.toString();
        }
        if ( extra !== 0 ) {
            loss += " + " + ( - extra ).toString();
        }
        if ( multiplier !== 1 || extra !== 0 ) {
            loss += " = " + CombatTurn.translateLoss( finalLoss );
        }
        return loss;
    }

    /**
     * Apply a multiplier to a combat endurance loss
     * @param {number|string} enduranceLoss The original endurance loss
     * @param multiplier The multiplier (can have decimals)
     * @return {number|string} The final endurance loss
     */
    public static applyMultiplier( enduranceLoss: number , multiplier: number ): number {

        if ( multiplier === 0 ) {
            // Ensure no death
            return 0;
        }

        if ( enduranceLoss !== COMBATTABLE_DEATH ) {
            // Apply the dammage multiplier
            enduranceLoss = Math.floor( enduranceLoss * multiplier );
        }

        return enduranceLoss;
    }

}
