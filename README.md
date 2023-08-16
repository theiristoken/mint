# It's time to grab TiTs!

The iris Token (TiT) is an ERC-20 living on Optimism. To mint TiTs, on must be an iris Verified Individual (iVI).

**Disclaimer: TiT relies on third parties to perform iris Verification. We do not collect, process or store any biometric data.**

## Genesis Offering

100% of TiT supply consists of allowances ranging from 1,000 TiTs to 10,000 TiTs depending on the time they were claimed. The earlier an iVI submits a claim, the higher the amount of the allowance. 

The maximum number of allowances is set to 1 million. 

Allowances start at 10,000 TiTs and decrease with time according to the following trend:

$$TiT(t) =  1000+10000000\cdot(\frac{\ln( \varDelta t+p)}{\varDelta t+p} )$$

$$Where \enspace p=10262.502185213996,$$

$$\varDelta t=t-t_{start}=\frac{T-T_{start}}{86400}\normalsize,$$

$$T_{start}=1692360000000,$$

$$and\enspace T\enspace is\enspace the\enspace current\enspace timestamp\enspace in\enspace milliseconds,$$



When a claim for an allowance is received from an iVI, a wallet specific signature is generated to allow the iVI to mint TiTs. The allowance is in "reserve" mode, which means the iVI has:
- secured a position in the queue that allows them to mint and;
- locked in the amount of TiTs they can possibly mint.

The signature is valid for a grace period of one week (7 · 24 · 3600 · 1000 milliseconds). After the grace period is over, if the allowance hasn't been minted, the signature expires and the iVI loses both their spot in the queue and their locked-in allowance amount. In this case, the iVI would ultimately have to submit a new allowance claim.

iVIs incur no cost to mint allowances besides network gas fees. Although gas fees are low on Optimism, we may provide gas subsidies to iVIs in need.

After all allowances are minted, admin rights are renounced to discontinue the creation of new TiTs. To simplify verification by TiT Holders and the general public, the corresponding transaction data will be made available through TiT diffusion channels.