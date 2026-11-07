/** Engine-independent boxplot configuration: five measures read in the order min, q1, median, q3, max. */
export default {id:'boxplot',label:'Boxplot',controls:['category','measures'],threeD:false,domains:false,
    doc:'Shows the spread of each group with five statistics: minimum, quartiles, median and maximum.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'Group',doc:'One box per row.'},
        {name:'min',parameter:'valueFields',count:1,required:true,dtype:'numeric',caption:'Minimum',doc:'The lowest value.'},
        {name:'q1',parameter:'valueFields',count:1,required:true,dtype:'numeric',caption:'First quartile',doc:'The value below which a quarter of the data falls.'},
        {name:'median',parameter:'valueFields',count:1,required:true,dtype:'numeric',caption:'Median',doc:'The middle value.'},
        {name:'q3',parameter:'valueFields',count:1,required:true,dtype:'numeric',caption:'Third quartile',doc:'The value below which three quarters of the data fall.'},
        {name:'max',parameter:'valueFields',count:1,required:true,dtype:'numeric',caption:'Maximum',doc:'The highest value.'}
    ]};
