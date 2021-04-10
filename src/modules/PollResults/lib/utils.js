const iconvlite = require('iconv-lite')

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
  const match = utf8Text.match(bloсkExp)
  const pollCodeExp = /00\/([\s\S]+?\n)/g
  const headerExp = /АО[\s\S]+?04\/[\D\d]+\n/gm
  const dateExp = /02\/(\d*)/g
  const cityExp = /04\/[\D\d].*$/gm
  const codesExp = /04\/[\D\d].*$([\s\S]+?)===/m
  const endBlockExp = /===/mg
  const userExp = /===\r?\n?(.*$)/m
  const codeTextExp = /([0-9]{3})([\s\S]*)/m

  const zz = []

  if (match) {

    for (let i = 0; i < match.length; i++) {
      const block = match[i]

      const endBlockSymbol = block.match(endBlockExp) ? block.match(endBlockExp) : null

      const header = block.match(headerExp) ? block.match(headerExp)[0] : null
      const pollCode = header.match(pollCodeExp) ? header.match(pollCodeExp)[0] : null
      const date = header.match(dateExp) ? header.match(dateExp)[0] : null
      const city = header.match(cityExp) ? header.match(cityExp)[0] : null
      const blockOfCodes = header.match(codesExp) ? header.match(codesExp)[1] : null

      const user = block.match(userExp) ? block.match(userExp)[1] : null
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
              city,
              pollCode,
              user,
              date,
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
            city: null,
            pollCode: null,
            user: null,
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