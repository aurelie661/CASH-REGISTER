let addArticleBtn = document.getElementById("addArticleBtn");
addArticleBtn.onclick = addArticle;
let proceedPaymentBtn = document.getElementById("proceedPaymentBtn");
proceedPaymentBtn.onclick = proceedPayment;
let cashBtnList = document.querySelectorAll(".btn_billet, .btn_coin");
cashBtnList.forEach(btn => {
    btn.onclick = addCashToAlreadyPaidAmount;
})

let amountToPayLbl = document.getElementById("amountToPayLbl");
let articleCounterLbl = document.getElementById("articleCounterLbl");
let amountAlreadyPaidLbl = document.getElementById("amountAlreadyPaidLbl");
let amountNeedPayLbl = document.getElementById("amountNeedPayLbl");

let cashFundInitializer = {
    "50E" : 0,
    "20E" : 5,
    "10E" : 5,
    "5E"  : 5,
    "2E"  : 10,
    "1E"  : 10,
    "50C" : 20,
    "20C" : 30,
    "10C" : 50,
    "5C"  : 50,
    "2C"  : 50,
    "1C"  : 50,
};
let cashFund = new Wallet("cashFund", cashFundInitializer);
// cashFund.getAmount();
let cashPaid = new Wallet("cashPaid");
let cashBack = new Wallet("cashBack");

let amountToPay = 0, 
    articleCounter = 0,
    amountAlreadyPaid = 0,
    amountNeedPay = 0;


function addArticle(){
    console.log("addArticle");
    /* Probabilité sur le prix :
     * [1c .. 1€[ -> 20%
     * [1€ .. 5€[ -> 40%
     * [5€ .. 10€[ -> 30%
     * [10€ .. 50€[ -> 10%
     */
    let aleatoire = getRandomNumber(0,100);
    let price = 0;
    if(aleatoire < 10){
        price = getRandomPrice(10, 50);
    }
    else if (aleatoire < 30){
        price = getRandomPrice(0.01, 1);
    }
    else if (aleatoire < 60){
        price = getRandomPrice(5, 10);
    }
    else{
        price = getRandomPrice(1, 5);
    }
    amountToPay += price;
    amountToPayLbl.innerText = amountToPay.toFixed(2);
    articleCounterLbl.innerText = ++articleCounter;
}

function proceedPayment(){
    console.log("proceedPayment");
    addArticleBtn.disabled = true;
    proceedPaymentBtn.disabled = true;
    cashBtnList.forEach(btn => {
        btn.disabled = false;
    })
}

function addCashToAlreadyPaidAmount(evt){
    console.log("addCashToAlreadyPaidAmount", cashFund.getValueFromCashName(evt.target.name));
    cashPaid.addCash(evt.target.name);
    cashFund.addCash(evt.target.name);
    amountAlreadyPaid = cashPaid.getAmount();
    amountAlreadyPaidLbl.innerText = amountAlreadyPaid.toFixed(2);
    amountNeedPay = amountToPay - amountAlreadyPaid;
    amountNeedPayLbl.innerText = amountNeedPay.toFixed(2);
    if(amountNeedPay <= 0){
        amountNeedPayLbl.innerText = "0.00";
        //stop payment
        cashBtnList.forEach(btn => {
            btn.disabled = true;
        })
        //start cashBack
        proceedCashBack();
    }
    let bp = 1;
}

function proceedCashBack(){
    console.log("proceedCashBack");
    let cnt = 0;//dev only
    amountNeedPay = Math.abs(amountNeedPay);
    while(amountNeedPay > 0){
        transferCashFundToCashBack("50E");
        transferCashFundToCashBack("20E");
        transferCashFundToCashBack("10E");
        transferCashFundToCashBack("5E");
        transferCashFundToCashBack("2E");
        transferCashFundToCashBack("1E");
        transferCashFundToCashBack("50C");
        transferCashFundToCashBack("20C");
        transferCashFundToCashBack("10C");
        transferCashFundToCashBack("5C");
        transferCashFundToCashBack("2C");
        transferCashFundToCashBack("1C");
        //dev only
        if(cnt++ > 100){
            break;
        }
    }
}

function transferCashFundToCashBack(name, quantity = 1){
    console.log("transferCashFundToCashBack : " + name);
    let cnt = 0;//dev only
    let value = cashFund.getValueFromCashName(name);
    while(amountNeedPay >= value && cashFund.removeCash(name, quantity)){
        amountNeedPay -= value;
        cashBack.addCash(name, quantity);
        //render
        template = document.querySelector(`#cashBackTemplates div[data-name="${name}"]`)
        let elementToAdd = template.cloneNode(true);
        document.getElementById("cashBackContainer").append(elementToAdd);
        //dev only
        if(cnt++ > 100){
            break;
        }
    }
    
}

/*
 * Tools Functions  
 */
function getRandomPrice(min, max){
    return +(Math.random() * (max - min) + min).toFixed(2);
}
function getRandomNumber(min, max, precision = 0){
    return +(Math.random() * (max - min) + min).toFixed(precision);
}