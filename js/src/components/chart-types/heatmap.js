/** Engine-independent heatmap configuration: two categories and one measure as cell color. */
export default {id:'heatmap',label:'Heatmap',controls:[],threeD:false,domains:false,
    doc:'Colours each cell of a grid of two categories by one measure.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'X category',doc:'The columns of the grid.'},
        {name:'secondCaptionField',parameter:'secondCaptionField',count:1,required:true,dtype:null,caption:'Y category',doc:'The rows of the grid; it must differ from the X category.'},
        {name:'value',parameter:'valueFields',count:1,required:true,dtype:'numeric',caption:'Value',doc:'The colour of each cell; one row per pair of categories.'}
    ]};
