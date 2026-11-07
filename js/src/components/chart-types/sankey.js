/** Engine-independent sankey configuration: source, target and one measure as link value. */
export default {id:'sankey',label:'Sankey',controls:['category','secondDimension','measures'],threeD:false,domains:false,
    doc:'Shows flows between nodes; the width of each link is its value.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'Source',doc:'The node a link starts from.'},
        {name:'secondCaptionField',parameter:'secondCaptionField',count:1,required:true,dtype:null,caption:'Target',doc:'The node a link ends at; it must differ from the source column, and links must not form a cycle.'},
        {name:'value',parameter:'valueFields',count:1,required:true,dtype:'numeric',caption:'Value',doc:'The width of each link; values must not be negative.'}
    ]};
