/** Engine-independent donut configuration. */
export default {id:'donut',label:'Donut',controls:[],threeD:false,
    doc:'Shows the share of each category in a total, as a ring.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'Slice',doc:'One slice per row, named by this column.'},
        {name:'measure',parameter:'valueFields',count:1,required:true,dtype:'numeric',caption:'Measure',doc:'The size of each slice; values must not be negative.'}
    ]};
