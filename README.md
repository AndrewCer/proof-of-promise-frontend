# Proof of Promise

Front end repo for PoP.

### Other repos:
- [API](https://github.com/AndrewCer/proof-of-promise-api)
- [Contracts](https://github.com/AndrewCer/proof-of-promise-contracts)

## PoP
[Live Demo](https://proofofpromise.xyz)

### What is a Promise?
"A declaration or assurance that one will do a particular thing or that a particular thing will happen."

### What is a PoP?
A digital, highly secure, verifiable handshake (between 2 or more entities)

### Why?
We aim to create a quicker, more secure, highly available way of signing agreements between entities.

Historically, NFTs have been used to issue proof of ownership - i.e. in the example of a home sale. However, we don’t see all of the handshaking that occurs off chain between responsible parties. There are a slew of papers that get signed before any deal is done. All of which sit either in some central portal that is hard to access or requires a fee to obtain. Or, reside in the depths of a box in a person's basement, never to be seen again. Proof of Promise aims to document these interactions and make them easily available for the specific parties, while also making the Promises bound and non-transferable. Each party involved in a Promise (or contract/agreement) is required to sign for the Promise to be valid. Sometimes this may be between two people, other times it’s between 1000s. PoP supports both of these use cases. 

PoP also provides an extra layer of security over traditional signatures. Difficult to forge, forever visible on chain, and easy to query, PoP has the power to change the way agreements and signatures are handled and retrieved.

Possibilities:
- Proof of partnership:
  - Ability to document a joint partnership between entities
    - Publicly display a verifiable token detailing said partnership. I.e. Website partner sections link directly to PoP txn, verifying that both parties are indeed involved.
- IP Agreement
  - An owner of an IP can create a PoP (in the future charging will be baked into the protocol) and then issue it to a singular address (or set of addresses). The terms, like length, will be detailed within the PoP or an off chain document that the PoP points to. Once the agreement is over (for natural or negligent reasons), the PoP will be burned and removed from the receiving parties wallet.
- Contract to contract agreements
   - The PoP can detail the specific requirements of this engagement. Both entities will be required to programmatically follow these rules until the PoP is terminated.
- ANY document that requires parties to sign:
  - NDAs
  - Loans
  - SAFEs
  - Terms of Service
  - etc
- IOUs between frens

### What should live on chain?
This is a question that is best left to the parties signing the Promise. PoP is flexible enough for everything to be on-chain or for the data to remain off-chain while the PoP simply represents the signature of agreement. PoP also supports a hybrid approach between these two.

For optimal security, a creator can store the agreement/document off-chain and point the PoP to said document. Ideally, the creator would then verify with the PoP protocol that the person trying to access their site is indeed the signer of the document.

Alternatively, if the contents of the Promise being singed don’t require tight security, the document can be uploaded directly to IPFs.


### What technologies are used?
- Solidity
- Ethers.js
- Infura
- WalletConnect
- Base
- Polygon
- Node.js
- Typescript
