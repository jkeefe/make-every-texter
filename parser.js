var request = require('request'),
    readability = require('node-readability');

// The next line reads in a file with my api keys.
// Delete it if you hard-code your keys into the code below
var keys = require('../api_keys/readability_keys'); 
    // Values read in:
    // READABILITY_PARSER_TOKEN      (called keys.READABILITY_PARSER_TOKEN)

// grab the url from the command line
// ... as the third argument in:
//   $ node parser.js http://johnkeefe.net/make-every-week-remote-controlled-egg
var textedUrl = process.argv[2];

// configure the request
var options = {
    url: "https://readability.com/api/content/v1/parser/?url=" + textedUrl + 
        "&token=" + keys.READABILITY_PARSER_TOKEN,
    method: "GET"
};

// make the request to the readability API
request(options, function (error, response, body){
    
    if (error || response.statusCode != 200) {
        
        // api call failed, output an error
        console.log("Failed hitting the Readability API:", error);
        
    } else {
        
        // Success! Parse the JSON from the body
        var content = JSON.parse(body);

        // Are we missing the date or author?
        if (!content.date_published || content.date_published === null || content.date_published ==="" || !content.author || content.author === null || content.author === "") {
            
            // If so, then hit the page ourselves
            readability(textedUrl, function(error, article, meta){
                
                if (error) {
                    // getting the raw page failed
                    console.log("Failed to get post from URL:", error);
                    
                } else {
                    
                    // check for dates
                    content.date_published = checkForDate(article.document);
                    // content.author = checkForAuthor(article.document);
                    outputFindings(content);
                    
                }

            });
            
        } else {

            // nothing was missing, output the content
            outputFindings(content);

        }
        
    }
    
});
      

// this looks for missing dates


function checkForDate(page_dom) {
    
        // POSTHAVEN?
        // see if there's a posthaven date div
        var x = page_dom.querySelectorAll("div.actual-date.posthaven-timezone-string");
        if (x.length > 0 && x[0].hasAttributes() ) {
            // grab the utc date from that div's attributes
            date = x[0].attributes['data-posthaven-date-utc-iso8601'].value; 
        } else {
            // default to "today"
            date = "today";
        }
        
        return date;
    
}

function outputFindings(content) {
    
    // output our findings            
    console.log("Title:", content.title);
    console.log("Author:", content.author);
    console.log("Excerpt:", content.excerpt);
    console.log("Image:", content.lead_image_url);
    console.log("Date:", content.date_published);
    
}

