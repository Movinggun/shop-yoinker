//--- lib Inlucdes
var webdriver = require ('selenium-webdriver');
var until = webdriver.until;
var By = webdriver.By;
var config = require ("./config.json");

//-- Setup Driver with chrome
var driver = new webdriver.Builder().forBrowser('chrome').build();


//-- Global oAuh Token for whatever reason
var authToken = "";

//-- Function will visit URL
function Goto(url) {
    driver.get(url);
    console.log('[Yoink V1]: Directing Browser to: ' + url);
} 

//--- ASYNC Sleep function
function Sleep(ms) {
    console.log('[Yoink V1:] Sleeping for ' + ms + "ms");
    return new Promise(resolve => setTimeout(resolve, ms));
}

//---Kills the process and browser
function Exit() {
    console.log('[Yoink V1]: Killing Script. Exit Code: 0');
    driver.quit();
}

//--- Function for when a click is needed....
function ClickOnElement(element) {
    driver.findElement(By.id(element)).click();
    console.log('[Yoink V1]: Clicking on Element: ' + element);
}

//--- Function for when we need to type some shit
function TypeInElement(element, message) {
    driver.findElement(By.id(element)).sendKeys(message);
    console.log('[Yoink V1]: Typing: ' + message + " into element: " + element);
}

//--- Function for when we want to submit a HTML Form
function SubmitForm(form, type) {
    if (type == 1) {
        driver.findElement(By.css(form)).submit();
        console.log('[Yoink V1]: Submitting: ' + form);
    }
    else {
        driver.findElement(By.id(form)).submit();
        console.log('[Yoink V1]: Submitting: ' + form);  
    }
}

//--- Aids functions to write card details...
async function PaymentInput(iframe, id, input) {
    driver.switchTo().frame(driver.findElement(By.css(iframe)));
    await Sleep (500);
    driver.findElement(By.id(id)).sendKeys(input);
    await Sleep (500);
    driver.switchTo().defaultContent();
    await Sleep (500);
}

//--- Here we go. This function is gunna be aids >_>   This inits sending card details
async function PaymentIWantToKillMyself(){
    driver.wait(until.elementLocated(By.name('checkout[payment_gateway]')), 500000).then(async function() {
        await Sleep(1500);
        PaymentInput('[id^=card-fields-number]', 'number', config.card.number);
        await Sleep (2000);
        PaymentInput('[id^=card-fields-name]', 'name', config.card.name);
        await Sleep (2000);
        PaymentInput('[id^=card-fields-expiry]', 'expiry', config.card.expiry);
        await Sleep (2000);
        PaymentInput('[id^=card-fields-verification_value]', 'verification_value', config.card.cvv);
        await Sleep (2000);
        SubmitForm('[data-payment-form=""]', 1);
    });
}

//--- Will bypass the queue and redriect to payment page with oAuth Token
async function BypassQueue() {
    driver.wait(until.elementLocated(By.id('checkout_shipping_address_zip')), 500000).then(function() {
        console.log("[Yoink V1]: Bypassing Shit Pages....")
        driver.getCurrentUrl().then(function(url) {
            Goto(url + "?previous_step=shipping_method&step=payment_method");
            console.log('[Yoink V1]: Redirecting to payment page. #GetFucked')
        });
    });
}

//--- I don't actually have a need for this anymore but left it in for Rustler. Yoinks the Auth Token
async function YoinkAuthToken() {
    driver.wait(until.elementLocated(By.id('checkout_shipping_address_zip')), 500000).then(function() {
        let token = driver.executeScript("return " + config.auth_token_var);
        token.then(function(res) {
            authToken = res;
            console.log("[Yoink V1]: Yoinked the token: " + res)      
        });
    });
}

//--- Method for handling login page
async function LoginPage() {
    driver.wait(until.elementLocated(By.id('customer_email')), 500000).then(async function() {
        console.log('[Yoink V1]: Logging into account!')
        TypeInElement('customer_email', config.username);
        TypeInElement('customer_password', config.password);
        await Sleep (1000);
        SubmitForm('customer_login', 0);
        console.log('[Yoink V1]: Logged in!');

    });
}

//--- Method for handlnig store page
async function StorePage(){
    ClickOnElement('add-to-cart');
    console.log("[Yoink V1]: Waiting  for website js to run! Zzzzzz.");
    driver.wait(until.elementLocated(By.id('quick-checkout-terms')), 500000).then(async function() {
        await Sleep(500);
        console.log('[Yoink V1]: Agreeing to TOS')
        ClickOnElement('quick-checkout-terms');
        console.log('[Yoink V1]: Going to checkout!')
        ClickOnElement('quick-checkout-btn');
    });
}

//--- Main Function.
async function Main(){
    Goto(config.url);
    StorePage();
    LoginPage();
    YoinkAuthToken();
    BypassQueue();
    PaymentIWantToKillMyself();
}

Main();

