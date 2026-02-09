// ===== UI制御部 =====
document.getElementById("submitBtn").addEventListener("click", function() {

    const inputValue = document.getElementById("numberInput").value;
    const parsedValue = parseInt(inputValue);
    const result = hanshinBraker(parsedValue);

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

  printTree() {
    if (this.left) this.left.printTree();
    if (this.right) this.right.printTree();

    if (this.isLeaf) {
      process.stdout.write(this.val + " ");
    } else {
      const op = this.op;
      if (op === 0 || op === 10) process.stdout.write("+ ");
      else if (op === 1 || op === 11) process.stdout.write("- ");
      else if (op === 2) process.stdout.write("* ");
      else if (op === 3) process.stdout.write("/ ");
      else if (op === 4) process.stdout.write("~ ");
    }
  }

  numCheck(s) {
    let key = 0;
    let hasOperator = false;

    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (!/[0-9]/.test(c)) hasOperator = true;

      if (key === 0 && c === '3') key = 1;
      else if (key === 1 && c === '3') key = 2;
      else if (key === 2 && c === '4' && hasOperator) return true;
    }
    return false;
  }

  formExpr(exprStack) {
    if (this.left) this.left.formExpr(exprStack);
    if (this.right) this.right.formExpr(exprStack);

    if (this.isLeaf) {
      exprStack.push(String(this.val));
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
        isNeedParenL = this.numCheck(leftVal);
        isNeedParenR = this.numCheck(rightVal);
        exprStack.push(
          (isNeedParenL ? "(" + leftVal + ")" : leftVal) +
          "*" +
          (isNeedParenR ? "(" + rightVal + ")" : rightVal)
        );
        break;

      case 3:
        isNeedParenL = this.numCheck(leftVal);
        isNeedParenR = this.numCheck(rightVal);
        exprStack.push(
          (isNeedParenL ? "(" + leftVal + ")" : leftVal) +
          "/" +
          (isNeedParenR ? "(" + rightVal + ")" : rightVal)
        );
        break;

      case 4:
        exprStack.push(leftVal + rightVal);
        break;

      case 10:
        exprStack.push("(" + leftVal + "+" + rightVal + ")");
        break;

      case 11:
        exprStack.push("(" + leftVal + "-" + rightVal + ")");
        break;
    }
  }

  setNode(op1, op2) {
    this.op = op1;

    let rightVal = 0;
    if (op2 === 0) rightVal = 7;
    else if (op2 === 1) rightVal = -1;
    else if (op2 === 2) rightVal = 12;
    else if (op2 === 3) rightVal = 3 / 4;
    else if (op2 === 4) rightVal = 34;
    else if (op2 === 5) rightVal = 7;

    this.left = new ExprNode(3);
    this.right = new ExprNode(rightVal);
    this.right.op = op2;

    this.right.left = new ExprNode(3);
    this.right.right = new ExprNode(4);

    this.left.isLeaf = true;
    this.right.left.isLeaf = true;
    this.right.right.isLeaf = true;
  }

  multiplyNode(key) {
    this.op = 2;
    this.left = new ExprNode(key);
    this.right = new ExprNode(this.val / key);

    this.left.partitionHandler();
    this.right.partitionHandler();
  }

  partitionHandler() {
    const val = this.val;

    // --- base cases ---
    if (val === 334) return this.setNode(4, 4);
    if (val === 132) return this.setNode(4, 2);
    if (val === 102) return this.setNode(2, 4);
    if (val === 37) return this.setNode(4, 0);
    if (val === 36) return this.setNode(2, 2);
    if (val === 29) return this.setNode(4, 1);

    if (val === 24) {
      this.op = 2;
      this.left = new ExprNode(6);
      this.left.op = 10;
      this.left.left = new ExprNode(3);
      this.left.right = new ExprNode(3);
      this.right = new ExprNode(4);
      this.left.left.isLeaf = true;
      this.left.right.isLeaf = true;
      this.right.isLeaf = true;
      return;
    }

    if (val === 21) return this.setNode(2, 10);
    if (val === 15) return this.setNode(0, 2);
    if (val === 13) return this.setNode(2, 0);
    if (val === 10) return this.setNode(0, 0);

    if (val === 9) {
      this.op = 0;
      this.left = new ExprNode(-3);
      this.right = new ExprNode(12);
      this.right.op = 2;
      this.right.left = new ExprNode(3);
      this.right.right = new ExprNode(4);
      this.left.isLeaf = true;
      this.right.left.isLeaf = true;
      this.right.right.isLeaf = true;
      return;
    }

    if (val === 5) {
      const a = Math.floor(Math.random() * 10);
      if (a > 4) this.setNode(2, 1);
      else this.setNode(3, 0);
      return;
    }

    if (val === 4) return this.setNode(1, 0);

    if (val === 3) {
      this.op = 2;
      this.left = new ExprNode(-3);
      this.right = new ExprNode(-1);
      this.right.op = 11;
      this.right.left = new ExprNode(3);
      this.right.right = new ExprNode(4);
      this.left.isLeaf = true;
      this.right.left.isLeaf = true;
      this.right.right.isLeaf = true;
      return;
    }

    if (val === 2) return this.setNode(0, 1);

    if (val === 1) {
      this.op = 3;
      this.left = new ExprNode(334);
      this.right = new ExprNode(334);
      this.left.partitionHandler();
      this.right.partitionHandler();
      return;
    }

    if (val === 0) {
      this.op = 3;
      this.left = new ExprNode(0);
      this.left.op = 11;
      this.left.left = new ExprNode(3);
      this.left.right = new ExprNode(3);
      this.right = new ExprNode(4);

      this.left.left.isLeaf = true;
      this.left.right.isLeaf = true;
      this.right.isLeaf = true;
      return;
    }

    // --- recursive cases ---
    const tryMul = [334,132,102,37,36,29,24,21,15,13,10,9,5,4,3,2];
    for (const k of tryMul) {
      if (val % k === 0) {
        this.multiplyNode(k);
        return;
      }
    }

    const r = Math.floor(Math.random() * (val / 2)) + 1;
    this.addPartition(r);
  }

  addPartition(left) {
    this.op = 0;

    if (!this.left && !this.right) {
      this.left = new ExprNode(left);
      this.right = new ExprNode(this.val - left);
    }

    this.left.partitionHandler();
    this.right.partitionHandler();
  }
}


class Stack {
  constructor() { this.a = []; }
  initStack() { this.a = []; }
  push(x) { this.a.push(x); }
  pop() { return this.a.pop(); }
  peek() { return this.a[this.a.length - 1]; }
}

function hanshinBraker(n) {
    const exprStack = new Stack();
    let tree = new ExprNode(n);
    tree.partitionHandler();
    exprStack.initStack();
    tree.formExpr(exprStack);
    console.log(n + " = " + exprStack.peek());
    
}
