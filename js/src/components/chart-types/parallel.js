/** Engine-independent parallel coordinates configuration: each measure is an axis, each row a polyline. */
export default {id:'parallel',label:'Parallel coordinates',controls:[],threeD:false,domains:false,
    doc:'Compares rows on several measures; each measure is a vertical axis, each row a line across them.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'Item',doc:'One line per row.'},
        {name:'measures',parameter:'valueFields',count:'many',required:true,dtype:'numeric',caption:'Measures',doc:'Each measure is one axis.'}
    ]};
