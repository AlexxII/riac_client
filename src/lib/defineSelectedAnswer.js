import { castCodes, serviceBtns } from './keycodes'
import beep from './beep'

// приведение клавиш доп.клавиатуры к кодам основной цифровой клавиатуры
function cast(keyCode) {
  if (castCodes[keyCode] !== undefined) return castCodes[keyCode];
  return keyCode;
}

function checkServiceBtn(keyCode) {
  if (serviceBtns[keyCode] !== undefined) return true;
}

const defineSelectedAnswer = (keyCode) => {
  if (checkServiceBtn(keyCode)) return 
  const code = cast(keyCode)
  return code
}
export default defineSelectedAnswer