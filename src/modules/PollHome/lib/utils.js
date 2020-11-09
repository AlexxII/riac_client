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
    let data = {}
    const element = xml.getElementsByTagName("opros")[0]
    data.title = element.getAttribute('name')
    data.code = element.getAttribute('cod')
    data.start = element.getAttribute('start_date')
    data.end = element.getAttribute('end_date')
    data.structure = {
      data: ''
    }
    return data
  } else {
    return false
  }
}

export default xmlparser