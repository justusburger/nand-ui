const rulesMap = {
  //                              SO  SU  BI  OI  CE  CO  J   FI
  // INSTRUCTION  STEP    CZ
  // FETCH
  '  xxxx         000     xx': '  0   0   0   0   0   1   0   0',
  '  xxxx         001     xx': '  0   0   0   0   1   0   0   0',

  // NOP
  '  0000         010     xx': '  0   0   0   0   0   0   0   0',
  '  0000         011     xx': '  0   0   0   0   0   0   0   0',
  '  0000         100     xx': '  0   0   0   0   0   0   0   0',

  // LDA
  '  0001         010     xx': '  0   0   0   0   0   0   0   0',
  '  0001         011     xx': '  0   0   0   0   0   0   0   0',
  '  0001         100     xx': '  0   0   0   0   0   0   0   0',

  // ADD
  '  0010         010     xx': '  0   0   0   0   0   0   0   0',
  '  0010         011     xx': '  0   0   1   0   0   0   0   0',
  '  0010         100     xx': '  1   0   0   0   0   0   0   1',

  // SUB
  '  0011         010     xx': '  0   0   0   0   0   0   0   0',
  '  0011         011     xx': '  0   0   1   0   0   0   0   0',
  '  0011         100     xx': '  1   1   0   0   0   0   0   1',

  // STA
  '  0100         010     xx': '  0   0   0   0   0   0   0   0',
  '  0100         011     xx': '  0   0   0   0   0   0   0   0',
  '  0100         100     xx': '  0   0   0   0   0   0   0   0',

  // LDI
  '  0101         010     xx': '  0   0   0   0   0   0   0   0',
  '  0101         011     xx': '  0   0   0   0   0   0   0   0',
  '  0101         100     xx': '  0   0   0   0   0   0   0   0',

  // JMP
  '  0110         010     xx': '  0   0   0   0   0   0   1   0',
  '  0110         011     xx': '  0   0   0   0   0   0   0   0',
  '  0110         100     xx': '  0   0   0   0   0   0   0   0',

  // JC
  '  0111         010     0x': '  0   0   0   0   0   0   0   0',
  '  0111         010     1x': '  0   0   0   0   0   0   1   0',
  '  0111         011     xx': '  0   0   0   0   0   0   0   0',
  '  0111         100     xx': '  0   0   0   0   0   0   0   0',

  // JZ
  '  1000         010     x0': '  0   0   0   0   0   0   0   0',
  '  1000         010     x1': '  0   0   0   0   0   0   1   0',
  '  1000         011     xx': '  0   0   0   0   0   0   0   0',
  '  1000         100     xx': '  0   0   0   0   0   0   0   0',

  // OUT
  '  1110         010     xx': '  0   0   0   1   0   0   0   0',
  '  1110         011     xx': '  0   0   0   0   0   0   0   0',
  '  1110         100     xx': '  0   0   0   0   0   0   0   0',
}

export default {
  rulesMap,
  numberOfAddressBits: 11,
  numberOfDataBits: 8,
}
