function testXml(xmlString) {
  var parser = new DOMParser();
  var docError = parser.parseFromString('INVALID', 'text/xml');
  var parsererrorNS = docError.getElementsByTagName("parsererror")[0].namespaceURI;
  var doc = parser.parseFromString(xmlString, 'text/xml');
  if (doc.getElementsByTagNameNS(parsererrorNS, 'parsererror').length > 0) {
    return false
  }
  return doc;
}

const xmlparser = (xmlString) => {
  const xml = testXml(xmlString)
  if (xml) {
    const results = xml.getElementsByTagName('a')
    const lResults = results.length
    let outData = []
    for (let i = 0; i < lResults; i++) {
      let resultData = {
        unit: results[i].getAttribute('usr_intrv'),
        date: results[i].getAttribute('date_intrv'),
        lan: results[i].getAttribute('start-lan'),
        lon: results[i].getAttribute('start-lon'),
      }
      const questions = results[i].getElementsByTagName('v')
      const lQuestions = questions.length
      let answersPool = []
      for (let i = 0; i < lQuestions; i++) {
        const answers = questions[i].getElementsByTagName('o')
        const lAnswers = answers.length
        for (let i = 0; i < lAnswers; i++) {
          const code = answers[i].getAttribute('c').padStart(3, "0")
          answersPool.push(code)
        }
        resultData.answers = answersPool
      }
      outData.push(resultData)
    }
    return outData
  } else {
    return false
  }
}

export default xmlparser