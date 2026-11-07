/** Engine-independent stacked bars configuration. */
export default {id:'stackedBar',label:'Stacked bars',controls:[],threeD:false,
    doc:'Shows the parts of a total for each category, with the measures stacked in one bar.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'Category',doc:'One bar per value of this column.'},
        {name:'measures',parameter:'valueFields',count:'many',required:true,dtype:'numeric',caption:'Measures',doc:'Each measure is one segment of the bar.'}
    ]};
