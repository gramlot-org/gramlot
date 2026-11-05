/** Shared numeric map presentation; zero is a value, missing is never zero. */
export function chartMapLabel(name,value,mode='value') {
    if(!['none','name','value','nameValue'].includes(mode))throw new TypeError('Choose a supported map label mode');
    if(mode==='none'||!Number.isFinite(value))return '';
    const number=value.toLocaleString('en-GB',{notation:'compact',maximumFractionDigits:1});
    return mode==='name'?name:mode==='value'?number:`${name}\n${number}`;
}
export const chartMapColors=['#77bce4','#307eb9','#083e80'];
