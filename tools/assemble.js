import { resolve } from 'path'
import fs from 'fs-extra'

const instructions = {
  NOP: '0000',
  LDA: '0001',
  ADD: '0010',
  SUB: '0011',
  STA: '0100',
  LDI: '0101',
  JMP: '0110',
  JC: '0111',
  JZ: '1000',
  OUT: '1110',
}

async function run() {
  const sourcePath = resolve(process.argv[2])
  const source = await fs.readFile(sourcePath)
  const lines = source
    .toString()
    .split('\n')
    .filter((line) => line.trim())
  const assembledLines = lines.map((line, i) => {
    const tokens = line.split(' ')
    const instruction = tokens[0]
    const argument = tokens[1] || '0'
    const instructionInBinary = instructions[instruction]
    if (!instructionInBinary)
      throw new Error(`Unknown instruction ${instruction} on line ${i + 1}`)
    const argumentInBinary = parseInt(argument).toString(2).padStart(4, '0')
    return `${instructionInBinary}${argumentInBinary}`
  })
  console.log(assembledLines.join('\n'))
}
run().catch(console.error)
