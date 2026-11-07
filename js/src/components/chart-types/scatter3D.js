/** Engine-independent 3d scatter configuration. */
export default {id:'scatter3D',label:'3D scatter',controls:['category','secondDimension','measures'],threeD:true,
    doc:'Shows each row as a point in 3D space.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'First dimension',doc:'The first axis; numeric or date values.'},
        {name:'secondCaptionField',parameter:'secondCaptionField',count:1,required:true,dtype:null,caption:'Second dimension',doc:'The second axis; numeric or date values.'},
        {name:'measures',parameter:'valueFields',count:'many',required:true,dtype:'numeric',caption:'Measures',doc:'Each measure is one series of points, at its height.'}
    ]};
