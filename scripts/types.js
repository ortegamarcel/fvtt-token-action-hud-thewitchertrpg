import { ACTION_TYPE } from "./constants.js";

export class ItemFilterOptions {
    /**
     * 
     * @param {Function} filterFn A mandatory filter function applied on actor items. Gets `Item` as input and must return a `boolean`.
     * @param {string} actionType Defaults to `ACTION_TYPE.consume`
     * @param {boolean} showQuantity Defaults to `true`
     */
    constructor(filterFn, actionType, showQuantity) {
        this.filterFn = filterFn;
        this.actionType = actionType ?? ACTION_TYPE.consume;
        this.showQuantity = showQuantity ?? true;
    }
}

export class FilterFn {
    static byTypeAndSubtype(type, subtype) {
        return item => item.type == type &&  item.system.type == subtype && item.system.quantity > 0;
    }

    static bySystemProp(systemPop, value) {
        return item => item.system[systemPop] == value;
    }
}