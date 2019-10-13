class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        // задаем начальные значения
        this.statesArray = config.states;
        this.activeState = config.initial;
        this.initialState = config.initial;
		this.getStatesArray = [];
		this.actionsArray = [];
		this.redoActionsArray = [];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        // возвращаем текущее значение состояния
        return this.activeState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        // изменяем состояние на заданное, либо возвращаем ошибку, если заданного состояния не существует
        if (this.statesArray[state]) {
            this.actionsArray.push(this.activeState);
            this.activeState = state;
            this.redoActionsArray = [];
        }
        else {
            throw new Error;
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        // если событие существует, переходим в соответствующее ему состояние, иначе - выдаем ошибку
        if (this.statesArray[this.activeState].transitions[event]) {
            this.changeState(this.statesArray[this.activeState].transitions[event]);
        }
		else {
            throw new Error;
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        // возвращаемся в изначальное состояние
        this.activeState = this.initialState;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        // если событие не задано, возвращаем все возможные состояния
        if (event === undefined) {
			return Object.keys(this.statesArray);
		}
		else {
            // если событие задано, возвращаем все соответствующие ему состояния
            let getStatesByEvent = [];
            Object.keys(this.statesArray).forEach(state => {
                if (this.statesArray[state].transitions[event]) {
                    getStatesByEvent.push(state);
                }
            })
            return getStatesByEvent;
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        // если массив с пройденными состояниями пуст - отменять нечего - возвращаем false
        if (this.actionsArray.length == 0) {
			return false;
		}
		else {
            // если не пуст - записываем последнее состояние в redoActionsArray и возвращаемся к предыдущему
            this.redoActionsArray.push(this.activeState);
            this.activeState = this.actionsArray.pop();
            return true;
		}
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        // если массив с отмененными состояниями пуст - возвращать нечего
        if (this.redoActionsArray.length == 0) {
			return false;
		}
		else {
            // если не пуст - записываем последнее состояние в actionsArray и шагаем на состояние вперед
            this.actionsArray.push(this.activeState);
            this.activeState = this.redoActionsArray.pop();
            return true;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        // очищаем историю состояний
        this.actionsArray = [];
		this.redoActionsArray = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
