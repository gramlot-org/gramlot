/** Engine-independent 2d map configuration. */
export default {id:'map',label:'2D map',controls:['geoJSON'],threeD:false,
    doc:'Colours each territory of a GeoJSON map by one measure.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'Territory',doc:'Matched to GeoJSON properties.name; one row per territory.'},
        {name:'mapValueField',parameter:'mapValueField',count:1,required:true,dtype:'numeric',caption:'Map measure',doc:'The value that colours each territory.'},
        {name:'mapLabelField',parameter:'mapLabelField',count:1,required:false,dtype:null,caption:'Map label',doc:'Text or number shown on each territory.'}
    ]};
