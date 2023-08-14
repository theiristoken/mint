# It's time to grab TiTs!

The iris Token (TiT) is an ERC-20 token living on Optimism, an EVM Layer-2. Only iris Verified Individuals (iVI) are able to signature mint TiTs.

**Disclaimer: TiT relies on a third party to certify iris uniqueness. We do not collect, process, store or handle any biometric data.**

## Genesis Offering

100% of TiT supply consists of allowances ranging from 1,000 TiTs to 10,000 TiTs depending on the time they were claimed. The earlier the claim, the higher the amount of allowance. 

The maximum number of allowances is set to 1 million. 

Allowances start at 10,000 TiTs and decrease with time according to the following trend:

$$TiT(t) =  1000+10000000\cdot(\frac{\ln( \varDelta t+p)}{\varDelta t+p} )$$

$$Where \enspace p=10262.502185213996,$$

$$\varDelta t=t-t_{start}=\frac{T-T_{start}}{86400}\normalsize,$$

$$T_{start}=1692100800000,$$

$$and\enspace T\enspace is\enspace the\enspace current\enspace timestamp\enspace in\enspace milliseconds,$$

Allowances are distributed at no cost to iVIs besides gas fees. Although gas fees are low on Optimism, we provide - for iVIs in need - gas subsidies to ensure fair access to TiTs.

When an allowance claim is received from an iVI, a wallet specific signature is generated to allow the iVI to mint TiTs. The allowance is in "reserve" mode, which means the iVI secured a spot in the queue to mint. The mintable amount of TiTs is locked in at the time the claim is received. 

- If the iVI chooses to pay for gas, they can mint their allowance immediately. 

- If not, the signature is valid for a grace period of one week (7 · 24 · 3600 · 1000 milliseconds) to give iVIs ample time to source the gas fee if needed. After the grace period, if a claim hasn't been minted, the signature expires and the iVI loses both their spot in the queue and their locked in allowance amount. To be able to mint an allowance, they would ultimately have to submit another claim.


After all allowances are minted, admin rights are renounced to avoid the creation of additional TiTs by calling the setOwner() function of TiT Smart Contract and setting it to the null address. To simplify verification by TiT Holders and the general public, the corresponding transaction hash will be made available through TiT diffusion channels. **It is important to note that the setOwner() function may not be called during the planet Mercury's retrograde.**