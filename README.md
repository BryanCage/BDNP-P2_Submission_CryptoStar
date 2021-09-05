# BDNP-P2_Submission_CryptoStar
Project 2: Decentralized App for Notarizing Star NFTs

Developed with truffle@5.0.2 and openzeppelin-solidity@2.3 </br>
ERC721 Token Name: CryptoStar </br>
ERC721 Symbol: STAR </br>
ERC721 Token Address (Rinkeby Test Network): 0x2c80560cabe663ce3a8e9c6288cbcdfe306ebec7 </br>

<h3>Installation and Getting Started</h3>
<ol><li>Clone Repository</li>
  
<pre>
<code>$git clone [git repo] CryptoStar</code>
</pre>
  <li>Navigate to the CryptoStar directory folder</li>
  <pre><code>cd CryptoStar</code></pre>
  <li>Install the Project Dependencies</li>
  <pre><code>npm install</code></pre>
  <li>Create two text files <strong>.mnemonic</strong> and <strong>.infurakey</strong>. These are used for connection to Rinkeby Test Network (see truffle-config.js)</li>
  
<pre><code>.mnemonic
.infuraKey
</code></pre>
  <li>Open a browser and navigate to <strong>infura.io/dashboard/ethereum</strong>. Select a project and copy the Project ID. Open the file <strong>.infurakey</strong> and paste your Project ID on the top line. Save and close the file.</li>
<li>Open the MetaMask extension from the browser. Retrieve and copy your 12 word mnemonic seed phrase. Open the file <strong>.mnemonic</strong> and paste your 12 word mnemonic seed phrase on the top line. Save and close the file.</li>
  <li>Open the truffle developement environment</li>
  <pre><code>truffle develop</code></pre>
  <li>Compile the contracts and migrate the contracts to the Rinkeby Test Network.</br> 
From within the truffle development environment command prompt: <strong>truffle(develop)></strong> 
</li>
  <pre><code>compile
migrate --reset --network Rinkeby</code></pre>
<li>Open another terminal and navigate into the /app directory</li>
<pre><code>cd app</code></pre>
  <li>Install dependencies for running app.js</li>
  <pre><code>npm install</code></pre>
 <li>Run the front-end server</li>
 <pre><code>npm run dev</code></pre>
 <li>Select the Rinkeby Test Network from the drop down list of networks at the top of the MetaMask Extension.</li>
 <li>Open http://localhost:8080 in a browser and select an account with a sufficient ETH balance from the MetaMask Extension. You may have to manually connect account if it isn't connected automatically.</li>
 <li>Go to the CryptoStar homepage and create a new star by typing a Star Name and Star ID and clicking the Create Star button.</li>
</ol>
