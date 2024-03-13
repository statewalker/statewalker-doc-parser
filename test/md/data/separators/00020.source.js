export default {
  description: "should tokenize separated text blocks with code lines ",
  input: `
  First paragraph

  Second paragraph... \${

    code line

  }
  ...seond paragraph continues

  Third paragraph
`
}