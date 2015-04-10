var request = require('request');

// The next line reads in a file with my api keys.
// Delete it if you hard-code your keys into the code below
var keys = require('../api_keys/readability_keys'); 
    // Values read in:
    // READABILITY_PARSER_TOKEN      (called keys.READABILITY_PARSER_TOKEN)

// grab the url from the command line
// ... as the third argument in:
//       node parser.js http://johnkeefe.com/hi-weatherbot
var textedUrl = process.argv[2];

// parse the URL
parseIt(textedUrl);


// This function sends a URL to the Readability API 
// and outputs the results to the console
function parseIt(parseUrl) {
    
    // configure the request
    var options = {
        url: "https://readability.com/api/content/v1/parser/?url=" + parseUrl + 
            "&token=" + keys.READABILITY_PARSER_TOKEN,
        method: "GET"
    };
    
    // make the request
    request(options, function (error, response, body){
        if (!error && response.statusCode == 200) {
            
            // Parse the JSON from the body
            var content = JSON.parse(body);
            
            // success! print body we got back
            console.log("Title:", content.title);
            console.log("Author:", content.author);
            console.log("Excerpt:", content.excerpt);
            console.log("Image:", content.lead_image_url);
            console.log("Date:", content.date_published);
            
        } else {
            
            // otherwise output an error
            console.log(error);
            
        }
        
    });
    
    
}
