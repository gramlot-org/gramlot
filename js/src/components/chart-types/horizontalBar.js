/** Engine-independent horizontal bars configuration. */
export default {id:'horizontalBar',label:'Horizontal bars',controls:[],threeD:false,
    doc:'Compares values across categories with horizontal bars; suited to long category names.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'Category',doc:'One bar group per value of this column, on the vertical axis.'},
        {name:'measures',parameter:'valueFields',count:'many',required:true,dtype:'numeric',caption:'Measures',doc:'Each measure is one series, drawn with its own colour.'}
    ]};
