/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { declareJqueryNumberFunctions } from "./views/viewsUtils/numberPicker";

/** Declare helper members for global types */
export function declareCommonHelpers(declareJqueryPlugins: boolean = true) {

    /****************** STRING ******************/

    if (typeof String.prototype.escapeRegExp !== "function") {
        String.prototype.escapeRegExp = function(this: string) {
            return this.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
        };
    }

    if (typeof String.prototype.replaceAll !== "function") {
        String.prototype.replaceAll = function(this: string, find, replace) {
            return this.replace( new RegExp( find.escapeRegExp(), "g"), replace );
        };
    }

    if (typeof String.prototype.unescapeHtml !== "function") {
        /**
         * Unescape HTML entities (ex. "&gt;" return ">" )
         * @return The unescaped version of the string
         */
        String.prototype.unescapeHtml = function() {
            return $("<span>").html(this).text();
        };
    }

    if (typeof String.prototype.getUrlParameter !== "function") {
        /**
         * Get a parameter value of a URL parameters.
         * The string must to be a parameters string (ex. "a=1&b=2")
         * @param sParam The parameter name to get (String)
         * @return The parameter value (string). null if it was not found
         */
        String.prototype.getUrlParameter = function(sParam) {

            const sPageURL = decodeURIComponent(this);
            const sURLVariables = sPageURL.split("&");

            for (const sURLVariable of sURLVariables) {
                const sParameterName = sURLVariable.split("=");

                if (sParameterName[0] === sParam) {
                    const value = sParameterName[1];
                    if ( value === undefined ) {
                        return null;
                    } else {
                        return decodeURIComponent(sParameterName[1]).replace(/\+/g, " ");
                    }
                }
            }
        };
    }

    if (typeof String.prototype.isValidFileName !== "function") {
        /**
         * Return true if it's a valid file name
         */
        String.prototype.isValidFileName = function() {
            return /^[a-z0-9_.\-() '"]+$/i.test(this);
        };
    }

    /****************** ARRAY ******************/

    if (typeof Array.prototype.removeValue !== "function") {
        Array.prototype.removeValue = function(value) {
            const index = $.inArray(value, this);
            if ( index >= 0 ) {
                this.splice(index, 1);
                return true;
            } else {
                return false;
            }
        };
    }

    if (!Array.prototype.deepClone) {
        Array.prototype.deepClone = function() {
            const copy = [];
            for (const element of this) {
                copy.push( element.clone ? element.clone() : element );
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return copy;
        };
    }

    /****************** WINDOW ******************/

    if (declareJqueryPlugins) {
        declareJqueryNumberFunctions();
    }
}

/****************** AJAX UTILS ******************/

/**
 * Get a human readable error for an AJAX error
 * @param {Object} context The "this" value for the error callback (oh javascript...)
 * @param {jqXHR} jqXHR The AJAX call itself
 * @param {String} textStatus Possible values for the second argument (besides null) are
 * "timeout", "error", "abort", and "parsererror"
 * @param {String} errorThrown The textual portion of the HTTP status, such as "Not Found"
 * or "Internal Server Error."
 * @returns {String} The error message for an AJAX error
 */
export function ajaxErrorMsg(context, jqXHR:JQueryXHR, textStatus:string, errorThrown:string) {
    if ( !errorThrown ) {
        errorThrown = "Unknown error (Cross domain error?)";
    }
    if ( !textStatus ) {
        textStatus = "";
    }
    const msg = context.url + " failed: " + errorThrown.toString() + ". Code: " + jqXHR.status +
        ". Status: " + textStatus /*+ '. Response text: ' + jqXHR.responseText*/;
    return msg;
}

/**
 * Get a rejected promise for an AJAX error
 * @param {Object} context The "this" value for the error callback (oh javascript...)
 * @param {jqXHR} jqXHR The AJAX call itself
 * @param {String} textStatus Possible values for the second argument (besides null) are
 * "timeout", "error", "abort", and "parsererror"
 * @param {String} errorThrown The textual portion of the HTTP status, such as "Not Found"
 * or "Internal Server Error."
 * @returns {Promise} The rejected promise
 */
export function ajaxErrorPromise(context, jqXHR:JQueryXHR, textStatus:string, errorThrown:string) {
    return ajaxErrorMsg(context, jqXHR, textStatus, errorThrown);
}
