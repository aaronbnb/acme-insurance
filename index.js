import fetch from 'node-fetch';

var ARCAccountCode = 'f8bb3411-ba90-4390-ad1b-7f7d52c65e48';
var ARCSubscriptionCode = '69710fd0-3024-4be1-8b54-9fbb95a1ff6f';

var SessionID;

main();

async function main(){

  SessionID = await StartSession();

  var sessionStatus = await GetSessionStatus();
  while(sessionStatus !== 400){
    await Sleep(500);
    sessionStatus = await GetSessionStatus();
  }
  console.log(`the sessionId is ${SessionID}`);

  await StartBrowser();

  var isBrowserReady = await GetBrowserStatus();
  while(isBrowserReady !== true){
    await Sleep(500);
    isBrowserReady = await GetBrowserStatus();
  }

  await OpenPage(encodeURI('http://www.healthscopebenefits.com'));

  await Sleep(5000);

  var arcResults = await AnalyzePage();
}

async function StartSession(){
  var requestURL = 'https://api.demo.tpgarc.com/v1/Automation/Session/New';

  console.log('Starting new automation session.');
  try{
    var response = await fetch(requestURL, {
      method: 'GET',
      headers: {
        'accept': 'application/json', 
        'arc-account-code': ARCAccountCode,
        'arc-subscription-key': ARCSubscriptionCode
      }
    });
    var requestResponse = await response.json();
    return requestResponse.result.sessionId;
  }
  catch(ex){
    console.log(`Error starting session: ${ex}`); 
  }
}

async function GetSessionStatus(){
  var requestURL = `https://api.demo.tpgarc.com/v1/Automation/Session/Status?sessionId=${SessionID}`;

  console.log('Checking automation session status.');
  try{
    var response = await fetch(requestURL, {
      method: 'GET',
      headers: {
        'accept': 'application/json', 
        'arc-account-code': ARCAccountCode,
        'arc-subscription-key': ARCSubscriptionCode
      }
    });
    var requestResponse = await response.json();
    return requestResponse.result.status;

  }
  catch(ex){
    console.log(`Error checking session status: ${ex}`); 
  }
}

async function StartBrowser(){
  var requestURL = `https://api.demo.tpgarc.com/v1/Automation/Session/${SessionID}/Browser/Open`;

  console.log('Starting new browser session.');
  try{
    var response = await fetch(requestURL, {
      method: 'POST',
      headers: {
        'accept': 'application/json', 
        'arc-account-code': ARCAccountCode,
        'arc-subscription-key': ARCSubscriptionCode
      }
    });
    var requestResponse = await response.json();
    return requestResponse.isOpen;
  }
  catch(ex){
    console.log(`Error starting browser session: ${ex}`); 
  }
}

async function GetBrowserStatus(){
  var requestURL = `https://api.demo.tpgarc.com/v1/Automation/Session//${SessionID}/Browser`;

  console.log('Checking browser status.');
  try{
    var response = await fetch(requestURL, {
      method: 'GET',
      headers: {
        'accept': 'application/json', 
        'arc-account-code': ARCAccountCode,
        'arc-subscription-key': ARCSubscriptionCode
      }
    });
    var requestResponse = await response.json();
    return requestResponse.result.isOpen;

  }
  catch(ex){
    console.log(`Error checking session status: ${ex}`); 
  }
}

async function OpenPage(URL){
  var requestURL = `https://api.demo.tpgarc.com/v1/Automation/Session/${SessionID}/Script/Step/run`;

  console.log('Opening Page.');
  try{
    var scriptStep = {};
    scriptStep.order = 1;
    scriptStep.id = 1;
    scriptStep.command = 'open';
    scriptStep.target = URL;
    scriptStep.value = '';
    scriptStep.state = '';

    var response = await fetch(requestURL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json', 
        'arc-account-code': ARCAccountCode,
        'arc-subscription-key': ARCSubscriptionCode
      },
      body: JSON.stringify(scriptStep)
    });
    var requestResponse = await response.json();
    return requestResponse.result;
  }
  catch(ex){
    console.log(`Error opening page: ${ex}`); 
  }
}

async function AnalyzePage(){
  var requestURL = `https://api.demo.tpgarc.com/v1/Automation/Session/${SessionID}/Analyze/Page`;

  console.log('Analyzing page.');
  try{
    var response = await fetch(requestURL, {
      method: 'GET',
      headers: {
        'accept': 'application/json', 
        'arc-account-code': ARCAccountCode,
        'arc-subscription-key': ARCSubscriptionCode
      }
    });
    var requestResponse = await response.json();
    console.log("Rules Engine: " + requestResponse.result.report.engineKey);
    console.log("Errors: " + requestResponse.result.report.errors);
    console.log("Alerts: " + requestResponse.result.report.alerts);
    console.log("Color Contrast: " + requestResponse.result.report.contrast);
    var assertions = requestResponse.result.report.assertions;
    console.log("WCAG 2.1 Failures: " + assertions)
    assertions.forEach(assertion => {
      var name = assertion.assertion;
      var category = assertion.category;
      var source = assertion.source;
      var remediation = assertion.remediation

      console.log("Assertion: " + name + "\n\n");
      console.log("Category: " + category + "\n\n");
      console.log("Source: " + source + "\n\n");
      console.log("Remediation: " + remediation + "\n\n");
    });;
    return requestResponse.result.report;

  }
  catch(ex){
    console.log(`Error checking session status: ${ex}`); 
  }  
}

async function Sleep(timeout){
  return new Promise((resolve)=>{
    setTimeout(() =>{
      return resolve();
    }, timeout);
  });
}