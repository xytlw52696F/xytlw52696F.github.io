// ===== ロジック部 =====
function processInteger(value) {
    if (!Number.isInteger(value)) {
        return "整数を入力してください";
    }

    if (value % 2 === 0) {
        return value + " は偶数です";
    } else {
        return value + " は奇数です";
    }
}

// ===== UI制御部 =====
document.getElementById("submitBtn").addEventListener("click", function() {

    const inputValue = document.getElementById("numberInput").value;
    const parsedValue = parseInt(inputValue);

    const result = processInteger(parsedValue);

    document.getElementById("result").textContent = result;
});
