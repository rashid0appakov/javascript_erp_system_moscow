function ArrayPresenter(){return{nodes:[],currentNode:null,add:function(){this.currentNode={name:"",args:[]},this.nodes.push(this.currentNode)},appendKey:function(e,n){32!==n&&(this.currentNode.name+=e)},appendValue:function(e){this.currentNode.args[this.currentNode.args.length-1]+=e},shiftValue:function(){this.currentNode.args.push("")},toJSON:function(){return this.nodes}}}export default ArrayPresenter;