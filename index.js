/*
Heavily based off Nick Marus' node-flint framework helloworld example: https://github.com/nmarus/flint
*/

var Flint = require('node-flint');
var webhook = require('node-flint/webhook');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
const config = require("./config.json");

/** This is what I wrote -- beginning **/
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
/** This is what I wrote -- ending **/

// init flint
var flint = new Flint(config);
flint.start();
console.log("Starting flint, please wait...");

flint.on("initialized", function () {
  console.log("Flint initialized successfully! [Press CTRL-C to quit]");
});

/****
 ## Process incoming messages
 ****/

/* On mention with command
ex User enters @botname /hello, the bot will write back
*/
flint.hears('hello', function (bot, trigger) {
  console.log("hello fired");
  bot.say('%s, you said hello to me!', trigger.personDisplayName);
});

/* On mention with command, using other trigger data, can use lite markdown formatting
ex "@botname /whoami"
*/
flint.hears('/whoami', function (bot, trigger) {
  console.log("/whoami fired");
  //the "trigger" parameter gives you access to data about the user who entered the command
  let roomId = "*" + trigger.roomId + "*";
  let roomTitle = "**" + trigger.roomTitle + "**";
  let personEmail = trigger.personEmail;
  let personDisplayName = trigger.personDisplayName;
  let outputString = `${personDisplayName} here is some of your information: \n\n\n **Room:** you are in "${roomTitle}" \n\n\n **Room id:** ${roomId} \n\n\n **Email:** your email on file is *${personEmail}*`;
  bot.say("markdown", outputString);
});

/* On mention with command arguments
ex User enters @botname /echo phrase, the bot will take the arguments and echo them back
*/
flint.hears('/echo', function (bot, trigger) {
  console.log("/echo fired");
  let phrase = trigger.args.slice(1).join(" ");
  let outputString = `Ok, I'll say it: "${phrase}"`;
  bot.say(outputString);
});

/** This is what I wrote -- beginning **/
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/spreadsheets'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Google Sheets API.
  authorize(JSON.parse(content), listMajors);
  //authorize(JSON.parse(content), coolaid);

});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function (err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function (code) {
    rl.close();
    oauth2Client.getToken(code, function (err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**flint.hears('check in', function (bot) {
  console.log("checking in fired");
  bot.say('checking item in');
  authorize(JSON.parse(content), coolaid);
  console.log("this has been authorized")

  function coolaid(auth) {
    // start here
    var sheets = google.sheets('v4');

    var values = [
      [null, null, null, null, null, "In"],
    ];
    var body = {
      values: values
    };
    sheets.spreadsheets.values.update({
      auth: auth,
      spreadsheetId: '1RJFCnNgNTUMdhLPe-ibANCpVXSApYvXzrE6Ftd836t8',
      range: 'Sheet1!A2:F',
      valueInputOption: 'USER_ENTERED',
      resource: body
    }, function (err, result) {
      if (err) {
        console.log('The API returned an error: ' + err);
      } else {
        console.log('%d cells updated.', result.updatedCells);
      }
    });
    //end here
  }

  bot.say('done checking the item in')
}); **/

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1RJFCnNgNTUMdhLPe-ibANCpVXSApYvXzrE6Ftd836t8/edit#gid=0
 */


;

function listMajors(auth) {
  flint.hears('check in', function (bot, trigger) {
    console.log("checking in fired");
    bot.say('checking item in');
    // start here
    var sheets = google.sheets('v4');
    var values = [
      [null, null, null, null, null, "In"],
    ];
    var body = {
      values: values
    };
    sheets.spreadsheets.values.update({
      auth: auth,
      spreadsheetId: '1RJFCnNgNTUMdhLPe-ibANCpVXSApYvXzrE6Ftd836t8',
      range: 'Sheet1!A2:F',
      valueInputOption: 'USER_ENTERED',
      resource: body
    }, function (err, result) {
      if (err) {
        console.log('The API returned an error: ' + err);
      } else {
        console.log('%d cells updated.', result.updatedCells);
      }
    });
    //end here

    bot.say('done checking the item in')
  })

  flint.hears('read', function (bot, trigger) {
    console.log("reading fired");
    bot.say('reading item');
    // start here
    var sheets = google.sheets('v4');
    sheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId: '1RJFCnNgNTUMdhLPe-ibANCpVXSApYvXzrE6Ftd836t8',
      range: 'Sheet1!A2:F',
    }, function (err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      var rows = response.values;
      if (rows.length == 0) {
        console.log('No data found.');
      } else {
        console.log('Name of Device, Status:');
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          // Print columns A and F, which correspond to indices 0 and 5.
          bot.say('%s, %s, %s, %s, %s, %s', row[0], row[1], row[2], row[3], row[4], row[5]);
        }
      }
    });
    bot.say('This are all the things that are in our inventory')
  })

};

/** This is what I wrote -- ending **/

/****
 ## Server config & housekeeping
 ****/

app.post('/', webhook(flint));

var server = app.listen(config.port, function () {
  flint.debug('Flint listening on port %s', config.port);
});

// gracefully shutdown (ctrl-c)
process.on('SIGINT', function () {
  flint.debug('stoppping...');
  server.close();
  flint.stop().then(function () {
    process.exit();
  });
});
