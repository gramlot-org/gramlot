/** Engine-independent 3d paths configuration. */
export default {id:'lines3D',label:'3D paths',controls:["category", "geoJSON", "geometry", "measures"],threeD:true,
    doc:'Draws paths of coordinates on a 3D map.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'Path',doc:'The name of each path.'},
        {name:'geometryField',parameter:'geometryField',count:1,required:true,dtype:null,caption:'Coordinates',doc:'A list of at least two longitude/latitude/altitude coordinates per row.'},
        {name:'measures',parameter:'valueFields',count:'many',required:false,dtype:'numeric',caption:'Measures',doc:'Each measure is one set of paths; values must not be negative.'}
    ]};
