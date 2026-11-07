/** Engine-independent sunburst configuration: nested Bag, one measure carried by the leaves. */
export default {id:'sunburst',label:'Sunburst',controls:[],threeD:false,domains:false,
    doc:'Shows a hierarchy as rings; the angle of each sector is the value.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'Label',doc:'The attribute that names each node of the nested Bag.'},
        {name:'measure',parameter:'valueFields',count:1,required:true,dtype:'numeric',caption:'Measure',doc:'Carried by the leaves; a parent is the sum of its children. Values must not be negative.'}
    ]};
