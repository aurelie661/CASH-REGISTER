
function Wallet(name, initializer){

    this.name = name;
    this.stock = {
        "50E" : 0,
        "20E" : 0,
        "10E" : 0,
        "5E"  : 0,
        "2E"  : 0,
        "1E"  : 0,
        "50C" : 0,
        "20C" : 0,
        "10C" : 0,
        "5C"  : 0,
        "2C"  : 0,
        "1C"  : 0,
    };

    if(initializer){
        // for(let key in initializer){
        //     this.stock[key] += initializer[key];
        // }
        //OU
        Object.assign(this.stock, initializer);
    }  

    this.addCash = function(name, quantity = 1){
        this.stock[name] += quantity;
    }

    this.removeCash = function(name, quantity = 1){
        if(this.countCash(name) >= quantity){
            this.stock[name] -= quantity;
            return true;
        }
        return false;
    }

    this.countCash = function(name){
        return this.stock[name];
    }

    
    this.getAmount = function(){
        let amount = 0;
        for(let key in this.stock){
            amount += this.stock[key] * this.getValueFromCashName(key);
        }
        //OU
        // amount = Object.keys(this.stock).reduce((total, key) => {
        //     return total + this.stock[key] * this.getValueFromCashName(key);
        // }, 0)
        return amount;
    }

    this.getValueFromCashName = function(name){
        let value = 0;
        if(name.indexOf("E") >= 0){
            value = +name.replace("E","");
        }
        else if(name.indexOf("C") >= 0){
            value = +name.replace("C","") / 100;
        }
        //OU
        //use a switch for each possible name
        return value;
    }

}