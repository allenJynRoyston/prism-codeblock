// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();
const Prism = require('prismjs');
const fs = require('fs');
const path = require('path')


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


app.get("/html/:file", async function(request, response) {
  let {file} = request.params 
  let res = await getFile(__dirname + `/snippets/html/${file}.html`)      
  if(res.success){
    let snippet = await attachStyle()    
    snippet += `
      <code>
        <pre class='language-html'>
          ${Prism.highlight(res.data, Prism.languages.html, 'html')}
        </pre>
      </code>
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
      <code>
        <pre class='language-javascript'>
          ${Prism.highlight(res.data, Prism.languages.javascript, 'javascript')}
        </pre>
      </code>
    `    
    response.send(snippet);    
  }
  else{
    response.sendFile(__dirname + "/views/noresults.html");
  }  
});



// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
