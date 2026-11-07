/** Columns at territory display anchors; each selected measure has its own color. */
export default {id:'mapBar3D',label:'3D bars on map',controls:['category','geoJSON','mapBarScale','measures'],threeD:true,
    doc:'Raises 3D columns on the territories of a GeoJSON map.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'Territory',doc:'Matched to GeoJSON properties.name; one row per territory.'},
        {name:'measures',parameter:'valueFields',count:'many',required:true,dtype:'numeric',caption:'Measures',doc:'Each measure is one column per territory; values must not be negative.'}
    ]};
