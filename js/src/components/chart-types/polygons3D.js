/** Engine-independent 3d polygons configuration. */
export default {id:'polygons3D',label:'3D polygons',controls:[],threeD:true,
    doc:'Draws polygons of coordinates as 3D shapes.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'Polygon',doc:'The unique name of each polygon.'},
        {name:'geometryField',parameter:'geometryField',count:1,required:true,dtype:null,caption:'Coordinates',doc:'Closed coordinate rings per row, including any holes.'},
        {name:'measures',parameter:'valueFields',count:'many',required:true,dtype:'numeric',caption:'Measures',doc:'Each measure is one set of polygons; values must not be negative.'}
    ]};
