export default {
  description: "should tokenize MD code blocks",
  input: `
    before 
    \`\`\`ts
    First Typescript Block
    \`\`\`

    \`\`\`js
    Javascript Block
    \`\`\`

    \`\`\`
    Simple Fenced Block
    \`\`\`
    after
    `
}