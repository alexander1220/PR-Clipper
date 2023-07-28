var copyButton = document.getElementById("copybtn");

copyButton.addEventListener("click", async function () {
    const tabId = await getCurrentTabId();
    if (tabId) {
        const pr = await getPullRequest(tabId);
        navigator.clipboard.writeText(pr.result);
        console.log(pr);
        copyButton.innerHTML = "Copied! 😎"
    } else {
        copyButton.innerHTML = "Something went wrong!"
        copyButton.style = "background-color:red;"
        console.error("Error getting tabId.");
    }
}, false);

async function getCurrentTabId() {
    try {
        const queryOptions = { active: true, currentWindow: true };
        const [tab] = await chrome.tabs.query(queryOptions);
        if (tab) {
            return tab.id;
        } else {
            console.error("No active tab found.");
            return null;
        }
    } catch (error) {
        console.error("Error getting current tab:", error);
        return null;
    }
}

/// WHY ARE YOU CHECKING THE SOURCE CODE, ╰（‵□′）╯
async function getPullRequest(tabId) {
    try {
        const [result] = await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: () => {
                var url = window.location.href;
                const prIdElement = document.querySelector('.pr-secondary-title-row-persona.flex-row.rhythm-horizontal-8.flex-center.flex-wrap');
                var prNumber = prIdElement ? prIdElement.children[1].textContent : "!#";
                const prNameElement = document.querySelector('[aria-label="Pull request title"]');
                var prName = prNameElement ? prNameElement.value : "<pr_name>"
                return prNumber + " on *" + prName + "* ready for review!\n" + url;
            },
        });
        return result;
    } catch (error) {
        console.error("Error getting PR ID:", error);
        return null;
    }
}