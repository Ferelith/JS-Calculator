"use strict";

// Calculator App
let number_buttons = document.querySelectorAll('.number_buttons div');
let operator_buttons = document.querySelectorAll('.operator_buttons div');
let input_field = document.getElementById('input_field');

let current_input = [];

for (let i = 0; i < number_buttons.length; i++) {
    number_buttons[i].addEventListener('click', (e) => {
        if(number_buttons[i].innerHTML == "C") {
            input_field.innerHTML = "";
            current_input = [];
        } else {
            current_input.push(number_buttons[i].innerHTML);
            
            for (let x = 0; x < current_input.length; x++) {
                input_field.innerHTML = current_input.join('');
            }
        }  
    });
}
for (let y = 0; y < operator_buttons.length; y++) {
    operator_buttons[y].addEventListener('click', (e) => {
        current_input.push(operator_buttons[y].innerHTML);
    });
}

  

