export default {
  description: "should allow code in tags, attributes, text etc",
  input: `before 
    <div \${{foo : \"Foo\", bar: \"Bar\"}} style=\${{ color:\"red\"}} title=\"Message: \${'Hello'}\">
      Red text: \${\"Hello, world\"}!
    </div>
    <!-- A \${this is the code} B --> 
    after
    `
}