/**
 * Form class
 */
class Form {

    /**
     * @param {string} selector 'bills_form'
     * @param {Bills} bills instance of Bills
     * @param {Table} table instance of Table
     * @param {Total} total instance of Total
     */
    constructor (selector, bills, table, total) {
        if(!(bills instanceof Bills))
            throw new Error(`Invalid bills, is not an instance of Bills class: ${bills}`);

        if(!(table instanceof Table))
            throw new Error(`Invalid table, is not an instance of Table class: ${table}`);

        if(!(total instanceof Total))
            throw new Error(`Invalid total, is not an instance of Total class: ${total}`);

        this.element = document.querySelector(selector);
        this.bills = bills;
        this.table = table;
        this.total = total;

        // validate the selector
        if(!this.element)
            throw new Error(`Could not find the selector: ${selector}`);

        // materialize selects plugin
        this._initSelects();

        // materialize date picker
        this._initDatePicker();

        // events
        this.element.addEventListener('submit', (e) => this.submit(e));
    }

    /**
     * Init the select with the existing Bill.TYPES available
     * init the select materialize plugin
     * @private
     */
    _initSelects () {
        // load the options into the select
        Bill.TYPES
            .map((type, i) => this._composeOption(type.toUpperCase(), type, i === 0))
            .forEach(option => this.element.type.appendChild(option));

        // init the materialize select plugin
        M.FormSelect.init(this.element.type);

    }

    /**
     * Compose a select option
     * @param {string} text
     * @param {string} value
     * @param {boolean} selected
     * @returns {HTMLElement}
     * @private
     */
    _composeOption (text, value, selected = false) {
        let option = document.createElement('option');
        option.innerText = text;
        option.value = value;
        if(selected) option.setAttribute('selected', '');
        return option
    }

    _initDatePicker () {
        // init date piciker
        M.Datepicker.init(this.element.date);
    }

    /**
     * submit method
     * @param {Event} event
     */
    submit (event = null) {
        // avoid the default form behavoir
        event.preventDefault();

        // is not valid
        let errors = this.validate();
        if (errors.length) {
            throw new Error(errors.join("\n"));
        }

        // form is valid
        this.bills.add(new Bill(
            this.element.name.value,
            this.element.amount.value,
            this.element.type.value,
            this.element.date.value
        ));

        // render the table
        this.table.render();
        this.total.render();

        // reset the form
        this.reset();
    }


    /**
     * Validates the form inputs
     * @return {array} errors
     */
    validate (){
        let errors = [];
        let bill = null;
        try {
            bill = new Bill(
                this.element.name.value,
                this.element.amount.value,
                this.element.type.value,
                this.element.date.value
            );
        } catch (e) {
            errors.push(e.message);
            return errors;
        }

        if(!bill.name) errors.push(`Invalid bill name: ${bill.name}`);
        if(bill.amount <= 0) errors.push(`Invalid bill amount: ${bill.amount}`);
        if(!bill.type) errors.push(`Invalid bill type: ${bill.type}`);

        return errors;
    }

    reset () {
        Bill.KEYS.forEach(name => {
            this.element[name].value = '';
        });

        // auto select the first type
        this.element.type.value = Bill.TYPES[0];
    }
}