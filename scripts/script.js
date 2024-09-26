"use strict";
class Calculator {
    constructor() {
        this.number_buttons = document.querySelectorAll('.number_buttons div');
        this.operator_buttons = document.querySelectorAll('.operator_buttons div');
        this.input_field = document.getElementById('input_field');

        this.current_input = [];

        this.addNumberListeners();
        this.addOperatorListeners();
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

    handleNumberClick(number) {
        this.current_input.push(number);
        this.updateDisplay();
    }
    handleOperatorClick(operator) {
        this.current_input.push(operator);
        this.updateDisplay();
    }
    updateDisplay() {
        this.input_field.innerHTML = this.current_input.join('');
    }
    clearDisplay() {
        this.input_field.innerHTML = "";
        this.current_input = [];
    }

}

const calculator = new Calculator();

