/** The group 'business' of calcolo.py (js_requires). */
export class Logic {
    calcolaSconto(kwargs) { return arrotonda(kwargs.prezzo * 0.9); }
}

function arrotonda(x) { return Math.round(x * 100) / 100; }
