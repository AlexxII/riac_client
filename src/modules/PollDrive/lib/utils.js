export const parseIni = (configData) => {
  let regex = {
    section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
    param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
    comment: /^\s*#.*$/,
    header: /"[^"\\]+(?:\\.[^"\\]*)*"/,
    chart: /chart.*/
  };
  let config = {};
  let lines = configData.split(/[\r\n]+/);
  let section = null;
  lines.forEach(function (line) {
    if (regex.comment.test(line)) {
      return;
    } else if (regex.param.test(line)) {
      let match = line.match(regex.param);
      if (section) {
        if (regex.chart.test(section)) {
          // если это секция с графиком, применить другую логику парсинга
          if (match[1] === 'data') {
            config[section][match[1]] = parseChartData(match[2])
          } else {
            config[section][match[1]] = parseParams(match[2]);
          }
        } else {
          config[section][match[1]] = parseParams(match[2]);
        }
      } else {
        config[match[1]] = parseParams(match[2]);
      }
    } else if (regex.section.test(line)) {
      let match = line.match(regex.section);
      // отбрасываем из обработки header -> добавляем при необходимости ниже
      if (match[1] !== 'header') {
        config[match[1]] = {};
        section = match[1];
      }
    } else if (line.length == 0 && section) {
      section = null;
    }
  });
  const resConfig = concatLogic(config)
  // если шапку не стерли из конфиг файла
  if (regex.header.test(configData)) {
    const header = configData.match(regex.header)[0]
    return {
      ...resConfig,
      header
    }
  } else {
    return resConfig
  }
}

const parseChartData = (data) => {
  const regExp = /[0-9.]{1,}/gm
  const trimData = data.replace(/\s*/g, '');
  let temp, out = []
  do {
    temp = regExp.exec(trimData);
    if (temp) {
      out.push(temp[0]);
    }
  } while (temp);
  return out
}

function concatLogic(config) {
  const regex = /([0-9]{1,})/gm;
  let result = {};
  let property = null;
  for (let key in config) {
    property = key.match(/[a-zA-Z]*/gm)[0];
    result[property] = {};
  }
  for (let key in config) {
    property = key.match(/[a-zA-Z]*/gm)[0];
    let suffix = key.match(regex);
    if (suffix !== null) {
      result[property][suffix] = config[key];
    } else {
      result[property][1] = config[key];
    }
  }
  return result;
}

function parseParams(data) {
  // избавляемся от пробелов
  let trimData = data.replace(/\s*/g, '');
  let regex = {
    srange: /([0-9]{1,3})|\[(.+?)\]/gm
  };
  let output = [];
  let temp;
  do {
    temp = regex.srange.exec(trimData);
    if (temp) {
      // одиночные
      if (temp[1] !== undefined) {
        output.push(temp[1]);
      }
      // диапазон
      if (temp[2] !== undefined) {
        let range = temp[2];
        output = output.concat(rangeToArray(range));
      }
    }
  } while (temp);
  return output;
}

function rangeToArray(data) {
  let regex = /(\d{1,3})\s*-\s*(\d{1,3})/gm;
  let result = (data.replace(regex, (...match) => {
    let temp = [];
    let start = match[1];
    let end = match[2];
    // если перепутаны места
    if (start > end) {
      start = match[2];
      end = match[1];
    }
    let length = (end - start) + 1;
    while (length) {
      start = start + '';
      temp.push(start.padStart(3, '0'));
      start++
      length--;
    }
    return temp;
  }));
  return result.split(',');
}

export const normalizeLogic = (logic) => {
  // console.log(logic);
  let normalizedLogic = {}
  for (let key in logic) {
    switch (key) {
      case 'difficult':
        normalizedLogic = {
          ...normalizedLogic,
          difficult: logic[key][1].answers
        }
        break
      case 'freeAnswers':
        normalizedLogic = {
          ...normalizedLogic,
          freeAnswers: logic[key][1].answers
        }
        break
      case 'exclude':
        const exclude = logic[key]
        let criticalExclude = {}
        let nonCriticalExclude = {}
        for (let i in exclude) {
          if (exclude[i].critical[0] === '1') {
            exclude[i].answers.map((answer) => {
              criticalExclude[answer] = exclude[i].exclude
            })
          }
          if (exclude[i].critical[0] === '0') {
            exclude[i].answers.map((answer) => {
              nonCriticalExclude[answer] = exclude[i].exclude
            })
          }
        }
        normalizedLogic = {
          ...normalizedLogic,
          criticalExclude,
          nonCriticalExclude
        }
        break
      case 'unique':
        normalizedLogic = {
          ...normalizedLogic,
          unique: logic[key][1].answers
        }
        break
      case 'header':
        normalizedLogic = {
          ...normalizedLogic,
          header: logic[key]
        }
        break
      case 'charts':
        const charts = logic[key]
        break
      case 'invisible':
        const invisible = logic[key]
        let invisiblePool = []
        for (let i in invisible) {
          invisiblePool = [
            ...invisiblePool,
            ...invisible[i].answers
          ]
        }
        normalizedLogic = {
          ...normalizedLogic,
          invisible: invisiblePool
        }
        break
    }
  }
  return normalizedLogic
}