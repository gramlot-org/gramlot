import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag} from '@genrojs/bag';
import {BagCollectionStore} from '../src/stores/bag-collection-store.js';
import {BagCollectionView} from '../src/stores/bag-collection-view.js';
import {chartBar3DOptions} from '../src/components/chart-bar3d-options.js';

for(const mode of ['attributes','values'])test(`adjacent measure bars on each plane: ${mode}`,()=>{
    const data=new Bag(),rows=new Bag();data.setItem('rows',rows);data.setBackref();
    [{product:'A',region:'North',revenue:250,advertising:70},
     {product:'B',region:'South',revenue:80,advertising:20}].forEach((record,i)=>rows.setItem(`r${i}`,mode==='values'?new Bag(record):null,mode==='attributes'?record:{}));
    const view=new BagCollectionView(new BagCollectionStore(rows,mode));view.connect();
    const fields=['revenue','advertising'],settings=[{color:'#5470c6'},{color:'#ee6666'}];
    try {
        const options=chartBar3DOptions(view,'product','region',fields,settings);
        const [revenue,advertising]=options.series;
        assert.deepEqual(revenue.data.map(row=>row[2]),[250,80]);
        assert.deepEqual(advertising.data.map(row=>row[2]),[70,20]);
        for(let i=0;i<2;i++){
            assert.equal(revenue.data[i][1],advertising.data[i][1]);
            assert.equal((revenue.data[i][0]+advertising.data[i][0])/2,i+1);
            const distance=(advertising.data[i][0]-revenue.data[i][0])*100/options.xAxis3D.max;
            assert.ok(distance>(revenue.barSize[0]+advertising.barSize[0])/2,'bar footprints do not overlap');
        }
        assert.deepEqual(options.legend.data,fields);
        assert.equal(revenue.itemStyle.color,'#5470c6');assert.equal(advertising.itemStyle.color,'#ee6666');
        assert.equal(options.xAxis3D.axisLabel.formatter(1),'A');
        assert.equal(options.tooltip.formatter({value:advertising.data[0],seriesName:'advertising'}),'product: A\nregion: North\nadvertising: 70');
        const single=chartBar3DOptions(view,'product','region',['advertising'],[settings[1]]);
        assert.equal(single.series[0].data[0][0],1);assert.equal(single.series[0].itemStyle.color,'#ee6666');
        assert.deepEqual(chartBar3DOptions(view,'product','region',[],[]).series,[]);
        view.applyFilter({value:'^North',columns:['region'],dtype:'T',locale:'en-GB'});
        assert.equal(chartBar3DOptions(view,'product','region',fields,settings).series[0].data.length,1);
    } finally {view.disconnect();}
});
