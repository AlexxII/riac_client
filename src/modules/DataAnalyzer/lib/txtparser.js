export const pensParser = (text) => {
  let empty = []
  let need = []
  let persons = []
  const rr = text.split('\n\r')
  const regEx = /нет сведен.., составляющ.. пенсионн.. прав.?/
  for (let i = 0; i < rr.length; i++) {
    if (regEx.test(rr[i])) {
      let person = []
      const splited = rr[i].split(' ')
      person.push(splited[7], splited[8], splited[9], splited[10])
      empty.push({
        person,
        data: null
      })
    } else {
      let person = []
      const splited = rr[i].split(' ')
      person.push(splited[7], splited[8], splited[9], splited[10])
      const full = rr[i]
      need.push({
        person,
        data: full
      })
    }
  }
  const result = {
    empty,
    need
  }
  return result
}

export const warior = (text) => {
  let empty = []
  let need = []
  let persons = []
  const rr = text.split('\n')
  for (let i = 0; i < rr.length; i++) {
    let person = []
    const splited = rr[i].split(';')
    person.push(splited[0], splited[1], splited[2], splited[3], splited[4])
    persons.push(person)
  }
  return persons
}

const compareLists = (war, pens) => {
  let doesNotMatch = []
  let warMatchPool = []
  // подсчет всех - просто промежуточные данные
  const pensData = [...pens.empty, ...pens.need]
  for (let i = 0; i < war.length; i++) {
    const warPersonName = war[i][2]
    const warPersonBorn = war[i][3]
    const warPersonDismissal = war[i][4]
    const warPersonSurname = warPersonName.split(' ')[0].toLowerCase()
    let comp = 0
    for (let j = 0; j < pensData.length; j++) {
      const pensPersonSurname = pensData[j].person[0].toLowerCase()
      const pensPersonBorn = pensData[j].person[3]
      if (warPersonSurname === pensPersonSurname & warPersonBorn === pensPersonBorn) {
        comp++
      }
    }
    if (comp) {
      warMatchPool.push(war[i])
    } else {
      doesNotMatch.push(war[i])
    }
  }
  // вычисление и склеивание только нужных персон
  const pensNeedData = [...pens.need]
  let resulNeedData = []
  let resultNotNeedData = []
  for (let i = 0; i < warMatchPool.length; i++) {
    const warPersonNum = warMatchPool[i][0]
    const warPersonRank = warMatchPool[i][1]
    const warPersonName = warMatchPool[i][2]
    const warPersonBorn = warMatchPool[i][3]
    const warPersonDismissal = warMatchPool[i][4]
    const warPersonSurname = warPersonName.split(' ')[0].toLowerCase()
    let comp = 0
    for (let j = 0; j < pensNeedData.length; j++) {
      const pensPersonSurname = pensNeedData[j].person[0].toLowerCase()
      const pensPersonBorn = pensNeedData[j].person[3]
      if (warPersonSurname === pensPersonSurname & warPersonBorn === pensPersonBorn) {
        const persD = [warPersonNum, warPersonRank, ...pensNeedData[j].person, warPersonDismissal]
        resulNeedData.push({
          person: persD,
          data: pensNeedData[j].data
        })
        comp++
      }
    }
    if (!comp) {
      // В/сл по которым нет сведения в пенсионном фонде
      const person = [warPersonNum, warPersonRank, warPersonName, warPersonBorn, warPersonDismissal]
      resultNotNeedData.push(
        person
      )
    }
  }
  return resulNeedData
}

export const processLists = (war, pens) => {
  const resulNeedData = compareLists(war, pens)
  let aLength = resulNeedData.length
  // let aLength = 4
  const regEx = /Факт работы \(с 2017/;
  let normalize = []
  let sheeet = []
  let finalResult = []
  for (let i = 0; i < aLength; i++) {
    const personData = resulNeedData[i]
    const person = personData.person
    const places = personData.data
    const splited = places.split('\n').slice(3)
    // if (!regEx.test(splited[0])) {
    //   console.log(person);
    // }
    finalResult.push({
      person,
      places: [...glueNormData(splited.slice(1))]
    })
  }
  return finalResult
}

export const compareDates = (data) => {
  const intrestPersons = data.map((obj, index) => {
    const dateReg = /^(\d{2}).(\d{2}).(\d{4})/
    const dateOfDismissal = Date.parse(obj.person[6].replace(dateReg, '01.$2.$3'))
    const dateMatch = obj.person[6].match(dateReg)
    const maxNeedDate = Date.parse('01.' + dateMatch[2] + '.' + (parseInt(dateMatch[3], 10) + + 2))
    const places = obj.places
    let placesOfWork = []
    for (let i = 0; i < places.length; i++) {
      const workDate = places[i].work
      let workArray = []
      for (let j = 0; j < workDate.length; j++) {
        const dateInWork = Date.parse(getDateFromString(workDate[j]))
        if (dateInWork >= dateOfDismissal & dateInWork <= maxNeedDate) {
          workArray.push(workDate[j])
        }
      }
      if (workArray.length) {
        placesOfWork.push({
          title: places[i].title,
          workDays: workArray
        })
      }
    }
    if (placesOfWork.length) {
      return { ...obj, places: placesOfWork }
    } else {
      return false
    }
  }).filter(person => person)
  return intrestPersons
}

const getDateFromString = (dString) => {
  const reg = /([а-яА-Я]+)\s(\d{4})/
  const dd = dString.match(reg)
  const month = dd[1]
  const year = dd[2]
  switch (month) {
    case 'январь':
      return '01.01.' + year
    case 'февраль':
      return '01.02.' + year
    case 'март':
      return '01.03.' + year
    case 'апрель':
      return '01.04.' + year
    case 'май':
      return '01.05.' + year
    case 'июнь':
      return '01.06.' + year
    case 'июль':
      return '01.07.' + year
    case 'август':
      return '01.08.' + year
    case 'сентябрь':
      return '01.09.' + year
    case 'октябрь':
      return '01.10.' + year
    case 'ноябрь':
      return '01.11.' + year
    case 'декабрь':
      return '01.12.' + year
  }
}

const glueNormData = (placesRaw) => {
  let places = []
  let dates = 1
  let title = ''
  let work = []
  const dataReg = /^(\S+) (\d{4})\s/
  // обработка данных от ПФР
  for (let k = 0; k < placesRaw.length; k++) {
    if (!dataReg.test(placesRaw[k])) {
      if (dates) {
        places = [...places, { title, work }]
        title = placesRaw[k]
        work = []
      } else {
        title += " " + placesRaw[k]
      }
      dates = 0
    } else {
      work.push(placesRaw[k])
      if (k === placesRaw.length - 1) {
        places = [...places, { title, work }]
      }
      dates = 1
    }
  }
  return places.slice(1)
}


// уже не надо
const glueSheetData = (placesRaw) => {
  let places = []
  let dates = 1
  let title = ''
  let work = []
  const dataReg = /\d{2}.\d{2}.\d{4}-\d{2}.\d{2}.\d{4}/
  const dataRegEx = /^(\S+) (\d{4})\s/
  // обработка данных от ПФР
  for (let k = 0; k < placesRaw.length; k++) {
    if (!dataReg.test(placesRaw[k]) & !dataRegEx.test(placesRaw[k])) {
      if (dates) {
        places = [...places, { title, work }]
        title = placesRaw[k]
        work = []
      } else {
        title += " " + placesRaw[k]
      }
      dates = 0
    } else {
      work.push(placesRaw[k])
      if (k === placesRaw.length - 1) {
        places = [...places, { title, work }]
      }
      dates = 1
    }
  }

  // нормализовать даты
  const workDates = places.map(obj => {
    const workArray = obj.work
    for (let i = 0; i < workArray.length; i++) {
      if (dataReg.test(workArray[i])) {
        console.log(workArray[i]);
      }
    }
    return obj
  })

  return places.slice(1)
}