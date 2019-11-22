var COLOR_PALETTE = [
  '#CDA164',
  '#EF843C',
  '#69B5FF',
  '#62CB86',
  '#9362CD',
  '#62CB86',
  '#f9320c',
  '#293462',
  '#dd2a7b',
  '#56A902',
  '#e94e77',
  '#fbd14b',
  '#ff585d',
  '#08D9D6',
  '#FF2E63',
  '#252A34',
  '#EAEAEA'
]

const getColor = (index) => {
  return COLOR_PALETTE[index % COLOR_PALETTE.length]
}

export default {
  getColor
}
