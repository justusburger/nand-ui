import { resolve } from 'path'

async function run() {
  const ruleFile = resolve(process.argv[2])
  const { numberOfAddressBits, rulesMap } = (await import(ruleFile)).default
  const numberOfAddresses = Math.pow(2, numberOfAddressBits)

  const rules = Object.keys(rulesMap)
    .map((key) => {
      const pattern = key
        .replace(/\s/g, '')
        .replace(/x/g, '.')
        .padStart(numberOfAddressBits, '0')
      const value = rulesMap[key].replace(/\s/g, '')
      return {
        key,
        pattern,
        valueInBinary: value,
        valueInDecimal: parseInt(value, 2),
        regExp: new RegExp(pattern),
      }
    })
    .filter((r) => r.valueInDecimal > 0)
  // console.log(rules)

  const results = {}
  for (let i = 0; i < numberOfAddresses; i++) {
    const addressInBinary = i.toString(2).padStart(numberOfAddressBits, '0')
    for (let j = 0; j < rules.length; j++) {
      const rule = rules[j]
      if (rule.regExp.test(addressInBinary) && rule.valueInDecimal > 0) {
        results[i] = rule.valueInDecimal
        break
      }
    }
  }

  console.log(JSON.stringify(results, null, 2))
}
run().catch(console.error)
