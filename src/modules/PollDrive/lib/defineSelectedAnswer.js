import { castCodes, serviceBtns, resetBtn, confirmBtns, answersCodes } from './keycodes'

// приведение клавиш доп.клавиатуры к кодам основной цифровой клавиатуры
function cast(keyCode) {
  if (castCodes[keyCode] !== undefined) return castCodes[keyCode];
  return keyCode;
}

function checkAnswerSelected(keyCode) {
  return answersCodes.includes(keyCode)
}

function checkResetBtn(keyCode) {
  return resetBtn.includes(keyCode)

}

function checkConfirmBtn(keyCode) {
  return confirmBtns.includes(keyCode)
}

function checkServiceBtn(keyCode) {
  return serviceBtns.includes(keyCode)
}

const defineSelectedAnswer = (keyCode) => {
  if (checkAnswerSelected(keyCode)) {
    return {
      do: 1,
      trueCode: cast(keyCode)
    }
  }
  if (checkServiceBtn(keyCode)) {
    return {
      do: 4
    }
  }
  if (checkResetBtn(keyCode)) {
    return {
      do: 2
    }
  }
  if (checkConfirmBtn(keyCode)) {
    return {
      do: 3
    }
  }
  return {
    do: 4
  }
}

export default defineSelectedAnswer