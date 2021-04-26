const iconvlite = require('iconv-lite')
const moment = require('moment')

export const rusToLatin = (str) => {
  var ru = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ё': 'e', 'ж': 'j', 'з': 'z', 'и': 'i',
    'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh',
    'щ': 'shch', 'ы': 'y', 'э': 'e', 'ю': 'u', 'я': 'ya'
  }, n_str = [];
  str = str.replace(/[ъь]+/g, '').replace(/й/g, 'i');
  for (var i = 0; i < str.length; ++i) {
    n_str.push(
      ru[str[i]]
      || ru[str[i].toLowerCase()] == undefined && str[i]
      || ru[str[i].toLowerCase()].toUpperCase()
    );
  }
  return n_str.join('');
}

export const prepareResultsDataToExport = (resultsPool) => {
  const regExp = /,/gi
  const lResults = resultsPool.length
  let allResults = ''
  for (let i = 0; i < lResults; i++) {
    const oderedResults = resultsPool[i].slice().sort((a, b) => (a.code > b.code) ? 1 : -1)
    const details = oderedResults.map(obj => {
      if (obj.text !== '') {
        return obj.code + ' ' + obj.text.replace(regExp, ';')
      }
      return obj.code
    })
    // кусок ниже, чтобы вставить перенос каретки при 180 символах и более, для Вити М.
    const rLength = details.length
    let tempResult = ''
    let counter = 0
    for (let j = 0; j < rLength; j++) {
      tempResult += details[j] + ','
      if (tempResult.length - counter > 80) {
        tempResult += '\n'
        counter = tempResult.length
      }
    }
    allResults += tempResult + '999' + '\n'
  }
  return allResults
}

export const parseOprFile = (inputData) => {
  const buf = Buffer.from(inputData);
  const utf8Text = iconvlite.decode(buf, 'utf8')
  const bloсkExp = /((АО[\s\S]+?===\r?\n?)(.*$))/gm
  const pollCodeExp = /00\/([\s\S]+?\n)/g
  const headerExp = /АО[\s\S]+?04\/[\D\d]+\n/gm
  const dateExp = /02\/(\d*)/g
  const cityExp = /04\/[\D\d].*$/gm
  const codesExp = /04\/[\D\d].*$([\s\S]+?)===/m
  const endBlockExp = /===/mg
  const userExp = /===\r?\n?(.*$)/m
  const codeTextExp = /([0-9]{3})([\s\S]*)/m
  const datePattern = /02\/(\d{2})(\d{2})(\d{2})/;

  const zz = []
  const match = utf8Text.match(bloсkExp)

  if (match) {

    for (let i = 0; i < match.length; i++) {
      const block = match[i]

      const endBlockSymbol = block.match(endBlockExp) ? block.match(endBlockExp) : null

      const header = block.match(headerExp) ? block.match(headerExp)[0] : null

      const pollCode = header.match(pollCodeExp) ? header.match(pollCodeExp)[0] : null
      const parsedDate = header.match(dateExp) ? header.match(dateExp)[0] : null
      const fff = parsedDate.replace(datePattern, '20$3-$2-$1')
      console.log(fff);
      const date = new Date(fff)
      const inputCity = header.match(cityExp) ? header.match(cityExp)[0] : null
      const blockOfCodes = header.match(codesExp) ? header.match(codesExp)[1] : null

      const inputUser = block.match(userExp) ? block.match(userExp)[1] : null
      const linesOfCodes = blockOfCodes.split('999').filter(obj => obj !== '\n')

      // разделение на строки
      if (linesOfCodes.length) {
        for (let j = 0; j < linesOfCodes.length; j++) {
          const result = []
          const line = linesOfCodes[j]
          const poolOfCodes = line.split(',')
          let respondent = {}
          if (poolOfCodes.length) {
            for (let k = 0; k < poolOfCodes.length; k++) {
              const codeWithText = poolOfCodes[k]
              const match = codeWithText.match(codeTextExp)
              if (match) {
                const code = match[1].trim()
                const text = match[2].trim()
                result.push({
                  code,
                  text
                })
              }
            }
            respondent = {
              inputCity,
              pollCode,
              inputUser,
              trueDate: date,
              date: moment(date).format('DD.MM.YYYY'),
              result
            }
            zz.push(respondent)
          }
        }
      }
    }
  } else {
    const linesOfCodes = utf8Text.split('999').filter(obj => obj !== '\n')
    if (linesOfCodes.length) {
      for (let j = 0; j < linesOfCodes.length; j++) {
        const result = []
        const line = linesOfCodes[j]
        const poolOfCodes = line.split(',')
        let respondent = {}
        if (poolOfCodes.length) {
          for (let k = 0; k < poolOfCodes.length; k++) {
            const codeWithText = poolOfCodes[k]
            const match = codeWithText.match(codeTextExp)
            if (match) {
              const code = match[1].trim()
              const text = match[2].trim()
              result.push({
                code,
                text
              })
            }
          }
          respondent = {
            inputCity: null,
            pollCode: null,
            inputUser: null,
            date: null,
            result
          }
          zz.push(respondent)
        }
      }
    }
  }
  return zz
}

export const similarity = (s1, s2) => {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

const editDistance = (s1, s2) => {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}