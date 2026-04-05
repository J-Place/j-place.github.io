  // compile the template
  var template1 = Handlebars.compile("{{body}}");
  console.log(template1({ body: "1 rocks!" }));


var template2 = Handlebars.compile("{{doesWhat}}");
// execute the compiled template and print the output to the console
console.log(template2({ doesWhat: "2 rocks!" }));




function getHeader() {
    var header = {}
}