// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();
const Prism = require('prismjs');
const fs = require('fs');
const path = require('path')
const pretty = require('pretty')
const beautify = require('js-beautify').js;

const getFile = (file) => {
  return new Promise(resolve => {
    fs.readFile(file, {encoding: 'utf-8'}, function(err,data){      
      resolve({success: !err, data: !err ? data : null})            
    });  
  })
}

const attachStyle = () => {
  return new Promise( async(resolve) => {
    let style = await getFile(__dirname + `/public/prism.css`)      
    resolve(`<style>${style.data}</style>`)
  })
}

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.static("snippets"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});


app.get("/htmlsrc", async function(request, response) {
  let {html = ''} = request.query
  let render = html
  let snippet = await attachStyle()    
  snippet += `
<pre class='language-html'><code>${Prism.highlight(pretty(render), Prism.languages.html, 'html')}</code></pre>
  `     
  response.send(snippet);        
});

app.get("/html/:file", async function(request, response) {
  let {file} = request.params 
  let res = await getFile(__dirname + `/snippets/html/${file}.html`)      
  if(res.success){
    let snippet = await attachStyle()    
    snippet += `
<pre class='language-html'><code>${Prism.highlight(pretty(res.data), Prism.languages.html, 'html')}</code></pre>
    `     
    response.send(snippet);        
  }
  else{
    response.sendFile(__dirname + "/views/noresults.html");
  }  
});


app.get("/js/:file", async function(request, response) {
  let {file} = request.params 
  let res = await getFile(__dirname + `/snippets/js/${file}.js`)  
  if(res.success){    
    let snippet = await attachStyle()    
    snippet += `
<pre class='language-javascript'><code>${Prism.highlight(res.data, Prism.languages.javascript, 'javascript')}</code></pre>
    `    
    response.send(snippet);    
  }
  else{
    response.sendFile(__dirname + "/views/noresults.html");
  }  
});

app.get("/jssrc", async function(request, response) {
  let {js = ''} = request.query
  let render = beautify(js, { indent_size: 2, space_in_empty_paren: true })
  let snippet = await attachStyle()    
  
  snippet += `
<pre class='language-html'><code>${Prism.highlight(render, Prism.languages.javascript, 'javascript')}</code></pre>
  `     
  response.send(snippet);        
});



// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
