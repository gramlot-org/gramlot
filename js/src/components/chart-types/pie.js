/** Engine-independent pie configuration. */
export default {id:'pie',label:'Pie',controls:['category','measures'],threeD:false,
    doc:'Shows the share of each category in a total.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'Slice',doc:'One slice per row, named by this column.'},
        {name:'value',parameter:'valueFields',count:1,required:true,dtype:'numeric',caption:'Value',doc:'The size of each slice; values must not be negative.'}
    ]};
