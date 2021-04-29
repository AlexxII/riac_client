const calc = () => {
  const ITER = 600
  var s = sample(
    [0, 0.1, 0.5, 0.3, 0, 0.1],
    ['001', '002', '003', '004', '005', '006']
  );
  const tt = s.next(ITER);
  const mm = tt.reduce((acum, item) => {
    if (!acum[item]) {
      acum[item] = 1
    } else {
      acum[item] = acum[item] + 1
    }
    return acum
  }, {})
  let result = {}
  for (let key in mm) {
    const p = mm[key]
    const proc = (p / ITER) * 100
    result[key] = proc
  }
  console.log(result);
  return result
}

const calcEx = () => {
  const sampler = walker([
    [0.00000001, '001'],
    [0.1, '002'],
    [0.5, '003'],
    [0.3, '004'],
    [0.00000001, '005'],
    [0.1, '006']]);
  const rr = []
  const ITER = 600
  for (let i = 0; i < ITER; i++) {
    rr.push(sampler())
  }
  const mm = rr.reduce((acum, item) => {
    if (!acum[item]) {
      acum[item] = 1
    } else {
      acum[item] = acum[item] + 1
    }
    return acum
  }, {})
  let result = {}
  for (let key in mm) {
    // console.log(mm[key]);
    const p = mm[key]
    const proc = (p / ITER) * 100
    result[key] = proc
  }
  console.log(result);
  return result
}

const calcExEx = () => {
  const sam1 = calc()
  const sam2 = calcEx()
  let result = {}
  for (let key in sam1) {
    const pr1 = sam1[key]
    const pr2 = sam2[key]
    const mid = (pr1 + pr2) / 2
    result[key] = mid
  }
  console.log(result);
}
