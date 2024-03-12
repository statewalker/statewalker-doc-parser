export default {
  description: "should parse style attribute with code",
  input: `
  <div style=\"display: grid; grid-auto-rows: 1fr; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-gap: 1rem;\">
    \${Promise.all(muybridge.filenames.map((f) => muybridge.file(f).image({style: \"width: 100%;\"})))}
  </div>
    `
}