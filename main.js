let web3;
let user;
const tokens = {
  kjc: {
    address: "0xd479ae350dc24168e8db863c5413c35fb2044ecd",
    decimals: 18
  },
  g3x24: {
    address: "0x6cfD8Fe423F20F94825b5edB1E94068fBea19dC9",
    decimals: 18
  },
  lydia: {
    address: "0x0fa662697d93Eb024f411E416f681EA7FECFcF96",
    decimals: 18
  }
};

const abi = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function"
  }
];

window.addEventListener("load", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    document.getElementById("connectWallet").onclick = async () => {
      try {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        user = accounts[0];
        document.getElementById("walletAddress").innerText = "✅ Connected: " + user;

        // Load token balances
        loadTokenBalance('kjc', 'kjcBalance');
        loadTokenBalance('g3x24', 'g3x24Balance');
        loadTokenBalance('lydia', 'lydiaBalance');
      } catch (err) {
        console.error("User rejected connection", err);
      }
    };
  } else {
    alert("Please install MetaMask or use Bitget Wallet DApp browser.");
  }
});

async function loadTokenBalance(tokenKey, elementId) {
  const token = new web3.eth.Contract(abi, tokens[tokenKey].address);
  try {
    const balance = await token.methods.balanceOf(user).call();
    const readable = balance / (10 ** tokens[tokenKey].decimals);
    document.getElementById(elementId).innerText = readable.toFixed(4);
  } catch (e) {
    console.error(`Error loading ${tokenKey} balance:`, e);
    document.getElementById(elementId).innerText = "0";
  }
}
