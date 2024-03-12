export default {
  description: "should read embeded code blocks",
  input: `before \${ js \`\${inner code}\` md\`\`\`code
\`\`\` } after`
}