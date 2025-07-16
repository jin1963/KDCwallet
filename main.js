let web3;
let userAccount;

window.addEventListener("load", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
  } else {
    alert("Please install MetaMask or Bitget Wallet");
  }
});

document.getElementById("connectWallet").onclick = async () => {
  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    userAccount = accounts[0];
    document.getElementById("walletAddress").innerText = userAccount;
    getBalances();
  } catch (error) {
    console.error(error);
  }
};

async function getBalances() {
  for (const [key, token] of Object.entries(tokenContracts)) {
    const contract = new web3.eth.Contract([
      {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function"
      }
    ], token.address);

    const balance = await contract.methods.balanceOf(userAccount).call();
    const formatted = (balance / 10 ** token.decimals).toFixed(4);
    document.querySelector(`#${key.toLowerCase()} .balance`).innerText = formatted;
  }
}
