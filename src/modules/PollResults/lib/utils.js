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
      if (tempResult.length - counter > 160) {
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
  const bloсkExp = /((АО[\s\S]+?===\r?\n?)([А-Яа-я .]+))/g
  // const headerExp = /АО[\s\S]+?04\/[\s\S]+?\n/g
  const headerExp = /АО[\s\S]+?04\/[\D\d]+\n/gm
  const pollCodeExp = /00\/([\s\S]+?\n)/g
  const dateExp = /02\/(\d*)/g
  const cityExp = /04\/[\D\d]+\n/g

  const match = utf8Text.match(bloсkExp)
  for (let i = 0; i < match.length; i++) {
    const block = match[i]
    const header = block.match(headerExp)[0]
    const pollCode = header.match(pollCodeExp)[0]
    const date = header.match(dateExp)
    const city = header.match(cityExp)[0]
    console.log(date);
  }
}