"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9432],{19432:function(t,r,e){e.r(r),e.d(r,{Edition:function(){return c}});var a=e(71567),n=e(53884),s=e(9279);e(13550),e(2162),e(64063),e(77191),e(54146),e(54098);class c extends n.S{static contractRoles=a.dp;constructor(t,r,e){let n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},s=arguments.length>4?arguments[4]:void 0,i=arguments.length>5?arguments[5]:void 0,p=arguments.length>6&&void 0!==arguments[6]?arguments[6]:new a.d4(t,r,s,n,e);super(p,e,i),this.abi=a.e.parse(s||[]),this.metadata=new a.ag(this.contractWrapper,a.dr,this.storage),this.app=new a.a$(this.contractWrapper,this.metadata,this.storage),this.roles=new a.ah(this.contractWrapper,c.contractRoles),this.royalties=new a.ai(this.contractWrapper,this.metadata),this.sales=new a.aj(this.contractWrapper),this.encoder=new a.af(this.contractWrapper),this.estimator=new a.aP(this.contractWrapper),this.events=new a.aQ(this.contractWrapper),this.platformFees=new a.aS(this.contractWrapper),this.interceptor=new a.aR(this.contractWrapper),this.signature=new a.aL(this.contractWrapper,this.storage,this.roles),this.owner=new a.aU(this.contractWrapper)}onNetworkUpdated(t){this.contractWrapper.updateSignerOrProvider(t)}getAddress(){return this.contractWrapper.readContract.address}async getAll(t){return this.erc1155.getAll(t)}async getOwned(t){return this.erc1155.getOwned(t)}async getTotalCount(){return this.erc1155.totalCount()}async isTransferRestricted(){let t=await this.contractWrapper.readContract.hasRole((0,a.bH)("transfer"),s.d);return!t}mint=(0,a.db)(async t=>this.erc1155.mint.prepare(t));mintTo=(0,a.db)(async(t,r)=>this.erc1155.mintTo.prepare(t,r));async getMintTransaction(t,r){return this.erc1155.getMintTransaction(t,r)}mintAdditionalSupply=(0,a.db)(async(t,r)=>this.erc1155.mintAdditionalSupply.prepare(t,r));mintAdditionalSupplyTo=(0,a.db)(async(t,r,e)=>this.erc1155.mintAdditionalSupplyTo.prepare(t,r,e));mintBatch=(0,a.db)(async t=>this.erc1155.mintBatch.prepare(t));mintBatchTo=(0,a.db)(async(t,r)=>this.erc1155.mintBatchTo.prepare(t,r));burn=(0,a.db)(async(t,r)=>this.erc1155.burn.prepare(t,r));async prepare(t,r,e){return a.aV.fromContractWrapper({contractWrapper:this.contractWrapper,method:t,args:r,overrides:e})}async call(t,r,e){return this.contractWrapper.call(t,r,e)}}},53884:function(t,r,e){e.d(r,{S:function(){return n}});var a=e(71567);class n{get chainId(){return this._chainId}constructor(t,r,e){this.contractWrapper=t,this.storage=r,this.erc1155=new a.aK(this.contractWrapper,this.storage,e),this._chainId=e}onNetworkUpdated(t){this.contractWrapper.updateSignerOrProvider(t)}getAddress(){return this.contractWrapper.readContract.address}async get(t){return this.erc1155.get(t)}async totalSupply(t){return this.erc1155.totalSupply(t)}async balanceOf(t,r){return this.erc1155.balanceOf(t,r)}async balance(t){return this.erc1155.balance(t)}async isApproved(t,r){return this.erc1155.isApproved(t,r)}transfer=(0,a.db)((()=>{var t=this;return async function(r,e,a){let n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:[0];return t.erc1155.transfer.prepare(r,e,a,n)}})());setApprovalForAll=(0,a.db)(async(t,r)=>this.erc1155.setApprovalForAll.prepare(t,r));airdrop=(0,a.db)((()=>{var t=this;return async function(r,e){let a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[0];return t.erc1155.airdrop.prepare(r,e,a)}})())}}}]);