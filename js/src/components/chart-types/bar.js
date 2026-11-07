/** Engine-independent bars configuration. */
export default {id:'bar',label:'Bars',controls:['category','measures'],threeD:false,
    doc:'Compares values across categories with vertical bars.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'Category',doc:'One bar group per value of this column.'},
        {name:'measures',parameter:'valueFields',count:'many',required:false,dtype:'numeric',caption:'Measures',doc:'Each measure is one series, drawn with its own colour.'}
    ]};
