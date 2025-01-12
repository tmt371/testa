function showLoginDialog() {
    const account = prompt("Please enter your account:");
    if (account === null) {
        window.close(); // 若用戶取消則關閉頁面
        return;
    }

    fetch('ACC.csv')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            let accountFound = false;
            let csvPassword = '';
            let username = '';

            // 檢查帳號是否存在
            for (const line of lines) {
                const [csvAccount, password, csvUsername] = line.split(',');
                if (csvAccount === account) {
                    accountFound = true;
                    csvPassword = password;
                    username = csvUsername;
                    break;
                }
            }

            if (!accountFound) {
                alert("Account not exists");
                showLoginDialog(); // 重新要求輸入帳號
            } else {
                promptPassword(account, csvPassword, username);
            }
        })
        .catch(error => {
            console.error("Error reading CSV:", error);
            alert("Failed to read account data.");
        });
}

function promptPassword(account, correctPassword, username) {
    const password = prompt(`Account "${account}" found. Please enter your password:`);
    if (password === null) {
        window.close(); // 若用戶取消則關閉頁面
        return;
    }

    if (password === correctPassword) {
        alert(`Welcome ${username}`);
        startMain(); // 啟動 main.js 的相關功能
    } else {
        alert("Incorrect password");
        promptPassword(account, correctPassword, username); // 重新要求輸入密碼
    }
}

function startMain() {
    console.log("Main script started");
    // 此處可加載 main.js 的邏輯
}

// 啟動登錄流程
showLoginDialog();
