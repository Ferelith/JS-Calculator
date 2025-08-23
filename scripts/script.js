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

        // Stores the input for calculation
        this.current_calc_input = [];

        this.addKeyboardSupport();
        this.addNumberListeners();
        this.addOperatorListeners();
        this.addEqualsButtonListener();
        this.addClearButtonListener();
        this.addDecimalPointListener();

    }

    addNumberListeners() {
        for (let i = 0; i < this.number_buttons.length; i++) {
            this.number_buttons[i].addEventListener('click', (e) => {
                this.handleNumberClick(this.number_buttons[i].innerHTML);
            });
        }
    }
    addOperatorListeners() {
        for (let y = 0; y < this.operator_buttons.length; y++) {
            this.operator_buttons[y].addEventListener('click', (e) => {
                this.handleOperatorClick(this.operator_buttons[y].innerHTML);
            });
        }
    }
    addClearButtonListener() {
        this.clear_button.addEventListener('click', () => {
            this.clearInput();
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
            if (!isNaN(key)) {
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
                        this.clearInput();
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

    handleNumberClick(number) {
        this.input_field.innerHTML += number; // Directly append the number to the input field
    }
    handleOperatorClick(operator) { // Handles the operator click event 
        // TODO: Allow negative numbers at the start
        if (this.input_field.innerHTML === "") {
            if (operator === '−') {
                this.input_field.innerHTML += '-'; // Handle the minus operator
            }
            return;
        }
        this.current_calc_input.push(this.input_field.innerHTML);
        this.current_calc_input.push(operator);
        this.input_field.innerHTML = "";
    }
    handleDecimalPointClick() {
        if (this.input_field.innerHTML.includes('.')) {
            return; // Prevent adding multiple decimal points
        }
        this.input_field.innerHTML += '0.'; // Append decimal point to the input field
    }
    handleEqualsClick() {
        if (this.input_field.innerHTML === "") {
            return; 
        }
        this.current_calc_input.push(this.input_field.innerHTML);
        const result = this.calculateResult(this.current_calc_input);
        this.updateCalculationHistory(this.current_calc_input);
        this.clearInput();
        this.input_field.innerHTML = result;
    }
    calculateResult(calc_input) {
        let result = parseFloat(calc_input[0]);
        for (let i = 1; i < calc_input.length; i += 2) {
            const operator = calc_input[i];
            const nextNumber = parseFloat(calc_input[i + 1]);
            switch (operator) {
                case '+':
                    result += nextNumber;
                    break;
                case '−':
                    result -= nextNumber;
                    break;
                case '×':
                    result *= nextNumber;
                    break;
                case '÷':
                    if (nextNumber === 0) {
                        return "Error"; // Handle division by zero
                    }
                    result /= nextNumber;
                    break;
                default:
                    console.log(`Unknown operator: ${operator}`);
                    return "Error"; // Handle unknown operator
            }
        }
        return result;
    }
    updateDisplay() {
        this.input_field.innerHTML = this.current_calc_input.join('');
    }
    updateCalculationHistory(currentCalculations) {
        // Display the calculation history
        let historyString = currentCalculations.join(' ') + ' =';
        this.input_history.innerHTML = historyString;
    }

    clearInput() {
        this.current_calc_input = [];
        this.clearDisplay();
    }
    clearDisplay() {
        this.input_field.innerHTML = "";
    }
}

const calculator = new Calculator();

