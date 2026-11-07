/** Engine-independent lines configuration. */
export default {id:'line',label:'Lines',controls:['category','measures'],threeD:false,
    doc:'Shows how values change along an ordered category, such as time.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'Category',doc:'The horizontal axis, in row order or time order.'},
        {name:'measures',parameter:'valueFields',count:'many',required:false,dtype:'numeric',caption:'Measures',doc:'Each measure is one series, drawn with its own colour.'}
    ]};
