/**
 * TABLE CLASS
 */
class Table {

    /**
     * @param {string} selector
     * @param {Bills} bills instance
     */
    constructor (selector, bills) {
        if(!(bills instanceof Bills))
            throw new Error(`Invalid bills, is not an instance of Bills class: ${bills}`);

        this.bills = bills;
        this.element = document.querySelector(selector);

        if(!this.element) throw new Error(`Could not find selector: ${selector}`);

        // elements
        this.thead = this.element.querySelector('thead');
        this.tbody = this.element.querySelector('tbody');

        // events delegation
        this.thead.addEventListener('click', (e) => this.sort(e))
    }

    /**
     * Render the table
     */
    render () {
        this.tbody.innerHTML = '';
        this.bills.data.forEach(bill => this.tbody.appendChild(Table.composeTr(bill)));
    }

    /**
     * Compose the bill tr
     * @param {Bill} bill
     * @returns {HTMLElement} tr with all the tds
     */
    static composeTr (bill) {
        let tr = document.createElement('tr');

        tr.appendChild(Table.composeTd(bill.name));
        tr.appendChild(Table.composeTd(bill.amount));
        tr.appendChild(Table.composeTd(bill.type.toUpperCase()));
        tr.appendChild(Table.composeTd(bill.date));

        return tr;
    }

    static composeTd (text) {
        let td = document.createElement('td');
        td.innerText = text;
        return td;
    }

    /**
     * Sort the table when a thead th is clicked
     * @param {Event} event
     * @returns {boolean}
     */
    sort (event) {
        if(event.target.tagName !== 'TH')
            return false;

        let sortBy = event.target.getAttribute('data-sort');

        // refresh the sort icon
        let icon = this.element.querySelector('.sort-icon');
        if(icon) icon.parentNode.removeChild(icon);
        let reverse = sortBy === this.bills.sortBy ? !this.bills.sortReverse : false;
        event.target.appendChild(Table.composeSortIcon(reverse));

        // sort the data
        this.bills.sort(sortBy);

        // refresh the table
        this.render();
    }

    /**
     * Compose the table sort icon
     * Uses material icons
     * @param {boolean} reverse determinates if the icon is down or up
     * @returns {HTMLElement}
     */
    static composeSortIcon (reverse = false) {
        let icon = document.createElement('i');
        icon.classList.add('sort-icon');
        icon.classList.add('material-icons');
        icon.classList.add('right');

        icon.innerText = `arrow_drop_${reverse ? 'up' : 'down'}`;
        return icon;
    }

}