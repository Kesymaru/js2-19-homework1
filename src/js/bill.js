/**
 * Bill class
 */
class Bill {
    static TYPES = ['a', 'b', 'c'];
    static KEYS = ['name', 'amount', 'type', 'date'];
    static SORT_KEYS = {
        name: 'string',
        amount: 'number',
        type: 'string',
        date: 'date'
    };
    static COUNTER = 0;

    constructor (name, amount, type, date) {
        if(!name || !amount || !type )
            throw new Error(`Invalid name, amount or type`);

        // validate the amount as a number
        if(isNaN(parseFloat(amount)))
            throw new Error(`Invalid type: ${amount}`);

        // date is always an date object
        date = date ? new Date(date) : new Date();

        this.name = name;
        this.amount = parseFloat(amount);
        this.type = type;
        this._date = date;
        this.id = Bill.COUNTER++;
    }

    get date () {
        return `${this._date.getDate()}/${this._date.getMonth()+1}/${this._date.getFullYear()} ${this._date.getHours()}:${this._date.getMinutes()}`;
    }
}

/**
 * All the bills list class
 */
class Bills {
    data = [];
    total = {a: 0, b: 0, c: 0};
    sortBy = '';
    sortReverse = false;

    /**
     * Add a new bill into the data
     * @param {Bill} bill
     */
    add (bill) {
        if(bill instanceof Bill){
            this.data.push(bill);
            return this.calculateTotal();
        }
        throw new Error(`Invalid bill is not an instance of Bill class`);
    }

    remove (bill) {
        if(bill instanceof Bill) {
            let found = this.data.find(b => b.id === bill.id);
            if(found) {
                // remove
            }
        }
        throw new Error(`Invalid bill is not an instance of Bill class`);
    }

    /**
     * Calculate the total for each type
     */
    calculateTotal () {
        this.total = {};

        // reset the values
        Bill.TYPES.forEach(type => this.total[type] = 0);

        for (let type in this.total) {
            this.total[type] = this.data
                .filter(bill => bill.type === type)
                .reduce((c, n) =>  (c.amount ? c.amount : c) + n.amount, 0);
        }
    }

    /**
     * Sort the table
     * @param {string} sortBy
     */
    sort (sortBy) {
        if(this.sortBy === sortBy)
            this.sortReverse = !this.sortReverse;
        else {
            // new sort, reset the values
            this.sortBy = sortBy;
            this.sortReverse = false;
        }

        this.data = this.data.sort((c, n) => {
            switch (Bill.SORT_KEYS[this.sortBy]) {
                case 'string':
                    return c[this.sortBy].localeCompare(n[this.sortBy]);
                case 'number':
                    return c[this.sortBy] < n[this.sortBy];
                case 'date':
                    return c._date < n._date;
                default:
                    break;
            }
        });

        // reverse the order
        if(this.sortReverse) this.data = this.data.reverse();
    }
}