const btn = document.getElementById("submitBtn");

btn.addEventListener("click", function () {

    if (btn.disabled) return;
    
    btn.disabled = true;

    setTimeout(() => { btn.disabled = false; }, 1000);

    const inputValue = document.getElementById("numberInput").value.trim();

    // 数字のみかチェック（正規表現）
    if (!/^-?[0-9]+$/.test(inputValue)) {
        alert("format error");
        return;
    }    
    const parsedValue = Number(inputValue);
    if(parsedValue > 9007199254740991){
        alert("this number is too large.");
        return;
    }   

    if(parsedValue < -9007199254740991){
        alert("this number is too small.");
        return;
    }   
    
    const inputArg1 = document.getElementById("inputArg1").value.trim();
    const inputArg2 = document.getElementById("inputArg2").value.trim();
    const inputArg3 = document.getElementById("inputArg3").value.trim();

    if (!/^[1-9]$/.test(inputArg1)) {
        alert("format error");
        return;
    }  
    if (!/^[0-9]$/.test(inputArg2)) {
        alert("format error");
        return;
    }  
    if (!/^[0-9]$/.test(inputArg3)) {
        alert("format error");
        return;
    }  


    const arg1 = Number(inputArg1);
    const arg2 = Number(inputArg2);
    const arg3 = Number(inputArg3);

    
    const result = hanshinBreaker(parsedValue,[arg1,arg2,arg3]);
    document.getElementById("result").textContent = result;

});

class ExprNode {

  constructor(val) {
    
    this.val = val;
    this.isLeaf = false;
    this.op = -1;
    this.left = null;
    this.right = null;
    
  }

  numCheck(s,args) {
    let key = 0;
    let hasOperator = false;

    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (!/[0-9]/.test(c)) hasOperator = true;

      if (key === 0 && c == args[0]) key = 1;
      else if (key === 1 && c == args[1]) key = 2;
      else if (key === 2 && c == args[2] && hasOperator) return true;
    }
    return false;
  }

  

  formExpr(exprStack,args) {
    if (this.left) this.left.formExpr(exprStack,args);
    if (this.right) this.right.formExpr(exprStack,args);

    if (this.isLeaf) {
      if(this.val >= 0) exprStack.push(String(this.val));
      else exprStack.push("(" + String(this.val) + ")");
      return;
    }

    const rightVal = exprStack.pop();
    const leftVal = exprStack.pop();

    let isNeedParenL = false;
    let isNeedParenR = false;

    switch (this.op) {
      case 0:
        exprStack.push(leftVal + "+" + rightVal);
        break;

      case 1:
        exprStack.push(leftVal + "-" + rightVal);
        break;

      case 2:
        isNeedParenL = this.numCheck(leftVal,args);
        isNeedParenR = this.numCheck(rightVal,args);
        exprStack.push(
          (isNeedParenL ? "(" + leftVal + ")" : leftVal) +
          "*" +
          (isNeedParenR ? "(" + rightVal + ")" : rightVal)
        );
        break;

      case 3:
        isNeedParenL = this.numCheck(leftVal,args);
        isNeedParenR = this.numCheck(rightVal,args);
        exprStack.push(
          (isNeedParenL ? "(" + leftVal + ")" : leftVal) +
          "/" +
          (isNeedParenR ? "(" + rightVal + ")" : rightVal)
        );
        break;

      case 4:
        exprStack.push(leftVal + rightVal);
        break;

      case 5:
        exprStack.push("(" + leftVal + "+" + rightVal + ")");
        break;

      case 6:
        exprStack.push("(" + leftVal + "-" + rightVal + ")");
        break;
            
      case 7:
        exprStack.push("-(" + rightVal + ")");
        break;

      
    }
  }



  initArith(arg1,arg2,arg3){
    let bases = [];

    bases = [
      //[0-9] add , *
      arg1 + arg2 + arg3, //[0]add ,add  3+3+4=10
      arg1 + arg2 - arg3, //[1]add ,sub  3+3-4=2
      arg1 + arg2 * arg3, //[2]add ,mul 3+3*4=15
      undefined,//[3]add ,dev 3+3/4=3
      arg1 + 10*arg2 + arg3, //[4]add ,concat 3+34=37
      (arg1 + arg2) * arg3, //[5](add) ,mul (3+3)*4=24
      undefined,undefined,undefined,undefined,
      //[10-19] sub , *
      arg1 - arg2 + arg3, //[10]sub ,add 3-3+4=4
      arg1 - arg2 - arg3, //[11]sub ,sub 3-3-4=-4
      arg1 - arg2 * arg3, //[12]sub ,mul 3-3*4=-9
      undefined,        //[13]sub ,dev 3-3/4=3
      arg1 - (10*arg2 + arg3), //[14]sub ,concat 3-34=-31
      (arg1 - arg2) * arg3, //[15](sub) ,mul (3-3)*4=0
      undefined,undefined,undefined,undefined,
      //[20-29] mul , *
      arg1 * arg2 + arg3, //[20]mul ,add 3*3+4=13
      arg1 * arg2 - arg3, //[21]mul ,sub 3*3-4=5
      arg1 * arg2 * arg3, //[22]mul ,mul 3*3*4=36
      undefined,       //[23]mul ,dev 3*3/4=2
      arg1 * (10*arg2 + arg3), //[24]mul ,concat 3*34=102
      arg1 * (arg2 + arg3), //[25]mul ,(add) 3*(3+4)=21
      arg1 * (arg2 - arg3), //[26]mul ,(sub) 3*(3-4)=-3
      undefined,undefined,undefined,
      //[30-39] dev , *
      undefined,undefined,undefined,undefined,undefined,
      undefined,undefined,undefined,undefined,(100*arg1+10*arg2+arg3)/(100*arg1+10*arg2+arg3),
      //[40-49] concat , *
      10*arg1 + arg2 + arg3, //[40]concat ,add 33+4=37
      10*arg1 + arg2 - arg3, //[41]concat ,sub 33-4=29
      (10*arg1 + arg2) * arg3, //[42]concat ,mul 33*4=132
      undefined,
      100*arg1+10*arg2+arg3, //[44]concat , concat
      100000*arg1+10000*arg2+1000*arg3+100*arg1+10*arg2+arg3, //[45]concat (concat , concat)
    ]

    if(arg2 != 0 && arg1 % arg2 === 0 ){
      bases[30] = arg1 / arg2 + arg3;//[30]dev ,add 3/3+4=5
      bases[31] = arg1 / arg2 - arg3;//[31]dev ,sub 3/3-4=-3
      bases[32] = arg1 / arg2 * arg3;//[32]dev ,mul 3/3*4=4
      if(arg1 % (arg2*arg3) === 0) bases[33] = arg1 / arg2 / arg3;//[33]dev,dev 3/3/4=0
      if(arg1 % (arg2+arg3) === 0) bases[34] = arg1 / (arg2 + arg3);//[34]dev ,(add) 3/(3+4)=0
      if(arg1 % (arg2-arg3) === 0) bases[35] = arg1 / (arg2 - arg3);//[35]dev ,(sub) 3/(3-4)=-1

    } 
    if(arg3!=0 && (arg1%arg3===0 || arg2%arg3===0)) bases[23] = arg1 * arg2 / arg3;
      

    if(arg3 !=0 && arg2 % arg3 === 0){
      bases[3] = arg1 + arg2 / arg3;
      if((arg1+arg2)%arg3===0) bases[6] = (arg1 + arg2)/arg3;

      bases[13] = arg1 - arg2 / arg3;
      if((arg1+arg2)%arg3===0) bases[16] = (arg1 - arg2)/arg3;
    }

    if(arg3!=0 && (10*arg1+arg2)%arg3 === 0 ) bases[43] = (10*arg1 + arg2) / arg3;
    

    //console.log(bases);

    return bases;
  }

  setNode(op1, op2, args) {
    this.op = op1;
    const arg1 = args[0];
    const arg2 = args[1];
    const arg3 = args[2];
    let rightVal = 0;

    if(op1 < 5){
      if (op2 === 0) rightVal = arg2 + arg3;
      else if (op2 === 1) rightVal = arg2 - arg3;
      else if (op2 === 2) rightVal = arg2 * arg3;
      else if (op2 === 3) rightVal = arg2 / arg3 ;
      else if (op2 === 4) rightVal = 10*arg2 + arg3;
      else if (op2 === 5) rightVal = arg2 + arg3;
      else if (op2 === 6) rightVal = arg2 + arg3;

      this.left = new ExprNode(arg1);
      this.right = new ExprNode(rightVal);
      this.right.op = op2;

      this.right.left = new ExprNode(arg2);
      this.right.right = new ExprNode(arg3);

      this.left.isLeaf = true;
      this.right.left.isLeaf = true;
      this.right.right.isLeaf = true;

    }else{

      let leftVal = arg1 + arg2;
      this.op = op2;
 
      this.left = new ExprNode(leftVal);
      this.right = new ExprNode(arg3);
      this.left.op = op1;

      this.left.left = new ExprNode(arg1);
      this.left.right = new ExprNode(arg2);

      this.left.left.isLeaf = true;
      this.left.right.isLeaf = true;
      this.right.isLeaf = true;


    }

  }

  partitionHandler(args,bases) {
    const val = this.val;
    console.log(val);
    const arg1 = args[0];
    const arg2 = args[1];
    const arg3 = args[2]; 
    if(!bases) bases = this.initArith(arg1,arg2,arg3);

    if (val < 0) {
        this.op = 7;
        this.right = new ExprNode(-val);
        return this.right.partitionHandler(args,bases);
    }
  

    // --- base cases ---
    if (val === bases[45]){
      this.op = 4;
      this.left = new ExprNode(100*arg1+10*arg2+arg3);
      this.right = new ExprNode(100*arg1+10*arg2+arg3);

      this.left.setNode(4,4,args);
      this.right.setNode(4,4,args);
      return;

    }else if (val > bases[45]){
      this.op = 0;
      const r = val % bases[45];
      this.left = new ExprNode(val - r);
      this.right = new ExprNode(r);
      this.left.multiplyNode(bases[45],args,bases);// val = bases[45]*q + r
      this.right.partitionHandler(args,bases);

      return;

    }


    if (val === bases[0])      return this.setNode(0 ,0, args);
    else if (val === bases[1]) return this.setNode(0 ,1, args);
    else if (val === bases[2]) return this.setNode(0 ,2, args);
    else if (val === bases[3]) return this.setNode(0 ,3, args);
    else if (val === bases[4]) return this.setNode(0 ,4, args);
    else if (val === bases[5]) return this.setNode(5 ,2, args);
    else if (val === bases[6]) return this.setNode(5 ,3, args);
    else if (val === bases[10]) return this.setNode(1 ,0, args);
    else if (val === bases[11]) return this.setNode(1 ,1, args);
    else if (val === bases[12]) return this.setNode(1 ,2, args);
    else if (val === bases[13]) return this.setNode(1 ,3, args);
    else if (val === bases[14]) return this.setNode(1 ,4, args);
    else if (val === bases[15]) return this.setNode(6 ,2, args);
    else if (val === bases[16]) return this.setNode(6 ,3, args);
    else if (val === bases[20]) return this.setNode(2 ,0, args);
    else if (val === bases[21]) return this.setNode(2 ,1, args);
    else if (val === bases[22]) return this.setNode(2 ,2, args);
    else if (val === bases[23]) return this.setNode(2 ,3, args);
    else if (val === bases[24]) return this.setNode(2 ,4, args);
    else if (val === bases[25]) return this.setNode(2 ,5, args);
    else if (val === bases[26]) return this.setNode(2 ,6, args);
    else if (val === bases[30]) return this.setNode(3 ,0, args);
    else if (val === bases[31]) return this.setNode(3 ,1, args);
    else if (val === bases[32]) return this.setNode(3 ,2, args);
    else if (val === bases[33]) return this.setNode(3 ,3, args);
    else if (val === bases[34]) return this.setNode(3 ,5, args);
    else if (val === bases[35]) return this.setNode(3 ,6, args);
    else if (val === bases[40]) return this.setNode(4 ,0, args);
    else if (val === bases[41]) return this.setNode(4 ,1, args);
    else if (val === bases[42]) return this.setNode(4 ,2, args);
    else if (val === bases[43]) return this.setNode(4 ,3, args);
    else if (val === bases[44]) return this.setNode(4 ,4, args);

    else if (val === bases[39]) { //1を返す
      this.op = 3;
      this.left = new ExprNode(100*arg1 + 10*arg2 + arg3);
      this.right = new ExprNode(100*arg1 + 10*arg2 + arg3);
      this.left.partitionHandler(args,bases);
      this.right.partitionHandler(args,bases);
      return;
    }

    const factors = bases.filter(x => x !== undefined).filter(x => x>1).sort((a,b) => b - a); 
    //console.log(factors);
    for (const f of factors) {
      if (val % f === 0) {
        this.multiplyNode(f,args,bases);
        return;
      }
    }

    const r = Math.floor(Math.random() * (val / 2)) + 1;
    this.addPartition(r,args,bases);
  }

  multiplyNode(key,args,bases) {
    this.op = 2;
    this.left = new ExprNode(key);
    this.right = new ExprNode(this.val / key);

    this.left.partitionHandler(args,bases);
    this.right.partitionHandler(args,bases);
  }

  addPartition(left,args,bases) {
    this.op = 0;

    if (!this.left && !this.right) {
      this.left = new ExprNode(left);
      this.right = new ExprNode(this.val - left);
    }

    this.left.partitionHandler(args,bases);
    this.right.partitionHandler(args,bases);
  }

 
}



class Stack {
  constructor() { this.a = []; }
  initStack() { this.a = []; }
  push(x) { this.a.push(x); }
  pop() { return this.a.pop(); }
  peek() { return this.a[this.a.length - 1]; }
}

function hanshinBreaker(n,args) {
    const exprStack = new Stack();
    let tree = new ExprNode(n);
    
    tree.partitionHandler(args);
    exprStack.initStack();
    tree.formExpr(exprStack,args);
    const result = Function("return " + exprStack.peek())();
    if (result === n) return n + " = " + exprStack.peek();
    else return "Error.";
  
}


