/**
 * Totals class
 * the class that displays the calculated total
 */
class Total {
    constructor (selector, bills){
        if(!(bills instanceof Bills))
            throw new Error(`Invalid bills is not an instance of Bills class: ${bills}`);

        this.element = document.querySelector(selector);
        this.bills = bills;

        if(!this.element)
            throw new Error(`Could not find the selector: ${selector}`);

        // render the total
        this.render();
    }

    /**
     * render the total
     */
    render() {
        let total = Bill.TYPES.filter(type => this.bills.total[type]);
        if(!total.length) return false;

        // clear
        this.element.innerHTML = '';

        // total title
        let title = document.createElement('h5');
        title.innerText = 'Totals:';
        this.element.appendChild(title);

        let col = document.createElement('div');
        col.classList.add('col');
        col.classList.add('s12');
        col.classList.add('m3');

        // compose the collection list
        col.appendChild(this.composeUl(total));
        this.element.appendChild(col);

        this.element.appendChild(Total.composeUpdated());
    }

    composeUl (total) {
        let ul = document.createElement('ul');
        ul.classList.add('collection');

        // compose the
        total.forEach(type => ul.appendChild(Total.composeLi(type.toUpperCase(), this.bills.total[type])));

        return ul;
    }

    /**
     * Compose a li
     * @param {string} title
     * @param {string} badge
     * @returns {HTMLElement}
     */
    static composeLi (title, badge) {
        let li = document.createElement('li');
        li.classList.add('collection-item');

        let icon = document.createElement('i');
        icon.classList.add('material-icons');
        icon.classList.add('left');
        icon.classList.add('red-text');
        icon.classList.add('text-accent-1');
        icon.innerText = 'check_circle';
        li.appendChild(icon);

        let b = document.createElement('b');
        b.innerText = title;
        li.appendChild(b);

        let span = document.createElement('span');
        span.classList.add('new');
        span.classList.add('badge');
        span.classList.add('indigo');
        span.setAttribute('data-badge-caption', '');
        span.innerText = badge;

        li.appendChild(span);
        return li;
    }

    static composeUpdated () {
        let date = new BillDate();
        let col = document.createElement('div');
        col.classList.add('col');
        col.classList.add('s12');

        let span = document.createElement('span');
        span.innerText = `Last updated: ${date.format()}`;
        col.appendChild(span);

        return col;
    }
    
}