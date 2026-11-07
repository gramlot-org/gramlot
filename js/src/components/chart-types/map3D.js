/** Engine-independent 3d map configuration. */
export default {id:'map3D',label:'3D map',controls:["category", "geoJSON", "measures"],threeD:true,
    doc:'Draws the territories of a GeoJSON map in 3D, one map per measure.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'Territory',doc:'Matched to GeoJSON properties.name.'},
        {name:'measures',parameter:'valueFields',count:'many',required:true,dtype:'numeric',caption:'Measures',doc:'Each measure is one map; values must not be negative.'}
    ]};
