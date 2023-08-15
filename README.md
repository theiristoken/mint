# It's time to grab TiTs!

The iris Token (TiT) is an ERC-20, living on Optimism, that can only be signature minted by iris Verified Individuals (iVI).

**Disclaimer: TiT relies on third parties to perform iris Verification. We do not collect, process or store any biometric data.**

## Genesis Offering

100% of TiT supply consists of allowances ranging from 1,000 TiTs to 10,000 TiTs depending on the time they were claimed. The earlier the claim, the higher the amount of allowance. 

The maximum number of allowances is set to 1 million. 

Allowances start at 10,000 TiTs and decrease with time according to the following trend:

$$TiT(t) =  1000+10000000\cdot(\frac{\ln( \varDelta t+p)}{\varDelta t+p} )$$

$$Where \enspace p=10262.502185213996,$$

$$\varDelta t=t-t_{start}=\frac{T-T_{start}}{86400}\normalsize,$$

$$T_{start}=1692122400000,$$

$$and\enspace T\enspace is\enspace the\enspace current\enspace timestamp\enspace in\enspace milliseconds,$$



When a claim for an allowance is received from an iVI, a wallet specific signature is generated to allow the iVI to mint TiTs. The allowance is in "reserve" mode, which means the iVI secured a position in the queue that allows them to mint. The mintable amount of TiTs is locked in at the time the claim is received. 

iVIs incur no cost to mint allowances besides network gas fees. Although gas fees are low on Optimism, we may provide gas subsidies to iVIs in need to ensure inclusive access to TiTs.

- If the iVI chooses to pay for gas, they can mint their allowance immediately. 

- If not, the signature is valid for a grace period of one week (7 · 24 · 3600 · 1000 milliseconds) to give iVIs ample time to source the gas fee if need be. After the grace period, if the allowance hasn't been minted, the signature expires and the iVI loses both their spot in the queue and their locked in allowance amount. To be able to mint an allowance, they would ultimately have to submit a new claim.


After all allowances are minted, admin rights are renounced to discontinue new TiT creation. To simplify verification by TiT Holders and the general public, the corresponding transaction hash will be made available through TiT diffusion channels.