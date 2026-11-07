/** Engine-independent treemap configuration: nested Bag, one measure carried by the leaves. */
export default {id:'treemap',label:'Treemap',controls:[],threeD:false,domains:false,
    doc:'Shows a hierarchy as nested rectangles whose area is the value.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'Label',doc:'The attribute that names each node of the nested Bag.'},
        {name:'value',parameter:'valueFields',count:1,required:true,dtype:'numeric',caption:'Value',doc:'Carried by the leaves; a parent is the sum of its children. Values must not be negative.'}
    ]};
