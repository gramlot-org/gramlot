/** Engine-independent area configuration. */
export default {id:'area',label:'Area',controls:['category','measures'],threeD:false,
    doc:'Shows how values change along an ordered category, filling the area under each line.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'Category',doc:'The horizontal axis, in row order or time order.'},
        {name:'measures',parameter:'valueFields',count:'many',required:true,dtype:'numeric',caption:'Measures',doc:'Each measure is one series, drawn with its own colour.'}
    ]};
