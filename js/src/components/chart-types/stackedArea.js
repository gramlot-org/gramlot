/** Engine-independent stacked area configuration. */
export default {id:'stackedArea',label:'Stacked area',controls:[],threeD:false,
    doc:'Shows the parts of a total along an ordered category, with the areas stacked.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'Category',doc:'The horizontal axis, in row order or time order.'},
        {name:'measures',parameter:'valueFields',count:'many',required:true,dtype:'numeric',caption:'Measures',doc:'Each measure is one stacked layer.'}
    ]};
