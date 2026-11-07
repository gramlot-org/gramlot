/** Engine-independent funnel configuration: stages of one measure. */
export default {id:'funnel',label:'Funnel',controls:[],threeD:false,domains:false,
    doc:'Shows how a quantity shrinks through ordered stages.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'Stage',doc:'One stage per row, in row order.'},
        {name:'measure',parameter:'valueFields',count:1,required:true,dtype:'numeric',caption:'Measure',doc:'The quantity at each stage; values must not be negative.'}
    ]};
