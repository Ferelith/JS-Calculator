"use strict";
class Calculator {
    constructor() {
        this.number_buttons = document.querySelectorAll('.number_buttons div:not(#clear_button, #result, #decimal_point)');
        this.operator_buttons = document.querySelectorAll('.operator_buttons div');
        this.clear_button = document.getElementById('clear_button');
        this.equals_button = document.getElementById('result');
        this.input_field = document.getElementById('input_current');
        this.input_history = document.getElementById('input_history');
        this.decimal_point = document.getElementById('decimal_point');

        this.current_calc_input = [];
        this.justEvaluated = false;
        this.errorState = false;

        this.addAccessibilityAttributes();
        this.addKeyboardSupport();
        this.addClickListeners(this.number_buttons, this.handleNumberClick);
        this.addClickListeners(this.operator_buttons, this.handleOperatorClick);
        this.addEqualsButtonListener();
        this.addClearButtonListener();
        this.addDecimalPointListener();

    }

    addAccessibilityAttributes() {
        // Map button text to more descriptive ARIA labels
        const labelMap = new Map([
            ['+', 'Add'],
            ['−', 'Subtract'],
            ['×', 'Multiply'],
            ['÷', 'Divide'],
            ['.', 'Decimal point'],
            ['C', 'Clear'],
            ['=', 'Equals'],
        ]);
        // Select all buttons
        const allButtons = [
            ...this.number_buttons,
            ...this.operator_buttons,
            this.decimal_point,
            this.clear_button,
            this.equals_button,
        ];
        // Add ARIA attributes to each button
        allButtons.forEach((button) => {
            if (!button) return;
            const text = button.textContent.trim();
            button.setAttribute('role', 'button');
            button.setAttribute('tabindex', '0');
            button.setAttribute('aria-label', labelMap.get(text) || text);
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
    }
    addClickListeners(buttons, handler) {
        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                handler.call(this, button.textContent.trim());
            });
        });
    }

    addClearButtonListener() {
        this.clear_button.addEventListener('click', () => {
            this.clearAll();
        });
    }
    addDecimalPointListener() {
        this.decimal_point.addEventListener('click', () => {
            this.handleDecimalPointClick();
        });
    }

    addEqualsButtonListener() {
        this.equals_button.addEventListener('click', () => {
            this.handleEqualsClick();
        });
    }
    addKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            const key = e.key;
            if (/^\d$/.test(key)) {
                this.handleNumberClick(key);
            } else {
                switch (key) {
                    case '+':
                        this.handleOperatorClick(key);
                        break;
                    case '-':
                        this.handleOperatorClick('−');
                        break;
                    case '*':
                        this.handleOperatorClick('×');
                        break;
                    case '/':
                        this.handleOperatorClick('÷');
                        break;
                    case 'Enter':
                        this.handleEqualsClick();
                        break;
                    case 'Backspace':
                        this.handleBackspace();
                        break;
                    case 'Escape':
                        this.clearAll();
                        break;
                    case '.':
                        this.handleDecimalPointClick();
                        break;
                    default:
                        break;
                }
            }
        });
    }

    getCurrentValue() {
        return this.input_field.textContent;
    }

    setCurrentValue(value) {
        this.input_field.textContent = value;
    }

    setHistoryValue(value) {
        this.input_history.textContent = value;
    }

    renderHistoryPreview() {
        const current = this.getCurrentValue();
        const tokens = [...this.current_calc_input];
        if (current !== "") {
            tokens.push(current);
        }
        this.setHistoryValue(tokens.join(' '));
    }

    handleNumberClick(number) {
        if (this.errorState) {
            this.clearAll();
        }
        if (this.justEvaluated) {
            this.justEvaluatedFlagOff();
        }
        const current = this.getCurrentValue();
        if (current === "0") {
            this.setCurrentValue(number);
        } else if (current === "-0") {
            this.setCurrentValue(`-${number}`);
        } else {
            this.setCurrentValue(current + number);
        }
        this.renderHistoryPreview();
    }
    handleOperatorClick(operator) { // TODO: Try and find a way to split this function as it does too many things.
        if (this.isErrorState()) { return; } // Stop if error sate is detected.
        const current = this.getCurrentValue(); 
        if (current === "") { // Decide what to do if current input is empty
            if (this.current_calc_input.length === 0 && operator === '−') { // Allow negative number start
                this.setCurrentValue('-');
                this.renderHistoryPreview();
                return;
            }
            const lastIndex = this.current_calc_input.length - 1;
            if (lastIndex >= 0) {
                this.current_calc_input[lastIndex] = operator; // Replace last operator
                this.renderHistoryPreview();
            }
            return;
        }
        const validCurrentInputPattern = /^-?\d+(?:\.\d+)?$/; // Check for valid number input (allowing for negative and decimal numbers)
        if (!validCurrentInputPattern.test(current)) {
            return;
        }

        this.current_calc_input.push(current); // Store number
        this.current_calc_input.push(operator); // Store operator
        this.setCurrentValue("");
        this.justEvaluated = false;
        this.renderHistoryPreview();
    }
    isErrorState() {
        return this.errorState;
    }
    handleDecimalPointClick() {
        if (this.errorState) {
            this.clearAll();
        }
        if (this.justEvaluated) {
            this.justEvaluatedFlagOff();
        }
        const current = this.getCurrentValue();
        if (current.includes('.')) {
            return;
        }
        if (current === "") {
            this.setCurrentValue('0');
        } else if (current === "-") {
            this.setCurrentValue('-0');
        }
        this.setCurrentValue(this.getCurrentValue() + '.');
        this.renderHistoryPreview();
    }
    handleEqualsClick() {
        if (this.errorState) {
            return;
        }
        const current = this.getCurrentValue();
        if (current === "" || current === "-" || current === ".") {
            return;
        }
        this.current_calc_input.push(current);
        const expression = this.current_calc_input.join(' ');
        const result = this.calculateResult(this.current_calc_input);
        if (result === "Error") {
            this.setHistoryValue(`${expression} = Error`);
            this.setCurrentValue("Error");
            this.errorState = true;
            this.current_calc_input = [];
            return;
        }
        this.setHistoryValue(`${expression} = ${result}`);
        this.current_calc_input = [];
        this.setCurrentValue(String(result));
        this.justEvaluated = true;
    }
    calculateResult(calc_input) {
        const tokens = [...calc_input];
        if (tokens.length === 0) {
            return "Error";
        }
        const collapsed = [parseFloat(tokens[0])];
        for (let i = 1; i < tokens.length; i += 2) {
            const operator = tokens[i];
            const nextNumber = parseFloat(tokens[i + 1]);
            if (Number.isNaN(nextNumber)) {
                return "Error";
            }
            if (operator === '×' || operator === '÷') {
                const lastIndex = collapsed.length - 1;
                const current = collapsed[lastIndex];
                if (operator === '×') {
                    collapsed[lastIndex] = current * nextNumber;
                } else {
                    if (nextNumber === 0) {
                        return "Error";
                    }
                    collapsed[lastIndex] = current / nextNumber;
                }
            } else if (operator === '+' || operator === '−') {
                collapsed.push(operator, nextNumber);
            } else {
                console.log(`Unknown operator: ${operator}`);
                return "Error";
            }
        }
        let result = parseFloat(collapsed[0]);
        for (let i = 1; i < collapsed.length; i += 2) {
            const operator = collapsed[i];
            const nextNumber = parseFloat(collapsed[i + 1]);
            if (operator === '+') {
                result += nextNumber;
            } else if (operator === '−') {
                result -= nextNumber;
            } else {
                console.log(`Unknown operator: ${operator}`);
                return "Error";
            }
        }
        return result;
    }

    handleBackspace() {
        if (this.errorState) {
            this.clearAll();
            return;
        }
        const current = this.getCurrentValue();
        if (current !== "") {
            this.setCurrentValue(current.slice(0, -1));
            this.renderHistoryPreview();
            return;
        }
        if (this.current_calc_input.length >= 2) {
            this.current_calc_input.pop();
            const previousNumber = this.current_calc_input.pop();
            this.setCurrentValue(previousNumber || "");
            this.renderHistoryPreview();
        }
    }

    clearAll() {
        this.current_calc_input = [];
        this.setHistoryValue("");
        this.setCurrentValue("");
        this.justEvaluated = false;
        this.errorState = false;
    }
    justEvaluatedFlagOff() {
        this.current_calc_input = [];
        this.setHistoryValue('');
        this.setCurrentValue('');
        this.justEvaluated = false;
    }
}

const calculator = new Calculator();
