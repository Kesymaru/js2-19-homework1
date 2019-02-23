/**
 * Bill Date class
 */
class BillDate extends Date {
    static MONTHS = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    static MONTHS_SHORT = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    static FORMATS = {
        yyyy: d => d.getFullYear(),
        dd: d => d.getDate(),
        mmmm: d => BillDate.MONTHS[d.getMonth()],
        mmm: d => BillDate.MONTHS_SHORT[d.getMonth()],
        mm: d => d.getMonth()+1,
        m: d => d.getMinutes(),
        h: d => BillDate.FORMATS.a(d) === 'PM' ? d.getHours() - 12 : d.getHours(),
        a: d => d.getHours()-12 > 0 ? 'PM' : 'AM'
    };

    /**
     * Format a date based on an format string
     * @param {string} format optional default dd mmm yyyy h:m
     */
    format (format = 'dd mmm yyyy h:m a') {
        if(!format || typeof format !== 'string') throw new Error(`Invalid date format: ${format}`);

        // format the date using the passed format string
        for(let k in BillDate.FORMATS) {
            format = format.replace(new RegExp(k), BillDate.FORMATS[k](this))
        }
        return format;
    }
}

/**
 * Bill class
 */
class Bill {
    static TYPES = ['a', 'b', 'c', 'd'];
    static KEYS = ['name', 'amount', 'type', 'date'];
    static SORT_KEYS = {
        name: 'string',
        amount: 'number',
        type: 'string',
        date: 'date',
    };
    static COUNTER = 0;

    constructor (name, amount, type, date) {
        if(!name || !amount || !type )
            throw new Error(`Invalid name, amount or type`);

        // validate the amount as a number
        if(isNaN(parseFloat(amount)))
            throw new Error(`Invalid type: ${amount}`);

        // date is always an Bill Date (extended from Date class)
        date = date ? new BillDate(date) : new BillDate();

        this.name = name;
        this.amount = parseFloat(amount);
        this.type = type;
        this._date = date;
        this.id = Bill.COUNTER++;
    }

    get date () {
        return this._date.format();
    }
}

/**
 * All the bills list class
 */
class Bills {
    data = [];
    total = {};
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