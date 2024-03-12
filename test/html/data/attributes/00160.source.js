export default {
  description: "should read attributes key/value pairs on multiple lines",
  input: `abc:$my-description
       =
        'b:\${
         <MyInternalWidget
           foo=\`\${<Foo bar=\"Baz\">}\`
           bar=\"Bar\" hello>
        }:c
     '`
}