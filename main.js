let web3;
let user;

window.addEventListener("load", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);

    document.getElementById("connectWallet").addEventListener("click", async () => {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        user = accounts[0];
        document.getElementById("walletAddress").innerText = "✅ Connected: " + user;

        // Load balances
        await loadAllTokenBalances();
      } catch (error) {
        console.error("Connection error:", error);
        alert("❌ Failed to connect wallet.");
      }
    });
  } else {
    alert("⚠️ Please use MetaMask or Bitget Wallet DApp browser.");
  }
});

const tokens = {
  kjc: {
    address: "0xd479ae350dc24168e8db863c5413c35fb2044ecd",
    decimals: 18,
    elementId: "kjcBalance"
  },
  g3x24: {
    address: "0xCcf14757654ddeF0eC30ab117C4Cf3aEbF3b5604",
    decimals: 18,
    elementId: "g3x24Balance"
  },
  lydia: {
    address: "0x0fa662697d93Eb024f411E416f681EA7FECFcF96",
    decimals: 18,
    elementId: "lydiaBalance"
  }
};

const abi = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function"
  }
];

async function loadAllTokenBalances() {
  for (const key in tokens) {
    const token = tokens[key];
    try {
      const contract = new web3.eth.Contract(abi, token.address);
      const balance = await contract.methods.balanceOf(user).call();
      const readable = balance / (10 ** token.decimals);
      document.getElementById(token.elementId).innerText = readable.toFixed(4);
    } catch (err) {
      console.error(`Failed to load ${key} balance:`, err);
      document.getElementById(token.elementId).innerText = "0";
    }
  }
}
