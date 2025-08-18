"use strict";
class Calculator {
    constructor() {
        this.number_buttons = document.querySelectorAll('.number_buttons div:not(#clear_button)');
        this.operator_buttons = document.querySelectorAll('.operator_buttons div');
        this.clear_button = document.getElementById('clear_button');
        this.input_field = document.getElementById('input_field');

        // Stores the input for calculation
        this.current_calc_input = [];

        this.addNumberListeners();
        this.addOperatorListeners();
        this.addClearButtonListener();
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

    handleNumberClick(number) {
        this.current_calc_input.push(number);
        this.updateDisplay();
        console.log(this.current_calc_input); // For debugging purposes
    }
    clearInput() {
        this.current_calc_input = [];
        this.clearDisplay();
    }
    handleOperatorClick(operator) { // This is where the array checks will happen - get values from input field.innerHTML

        this.current_calc_input.push(operator); // TODO: Check last element in the array before allowing operator
        this.updateDisplay();
        // TODO: Add numbers to the array once operator is clicked.
    }
    updateDisplay() {
        this.input_field.innerHTML = this.current_calc_input.join('');
    }
    clearDisplay() {
        this.input_field.innerHTML = "";
    }

}

const calculator = new Calculator();

